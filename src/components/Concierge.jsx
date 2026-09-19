import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  briefGroups,
  briefLabels,
  briefSteps,
  concierge,
  guardTerms,
  topics,
} from "../content/concierge.js";
import { studio } from "../content/site.js";
import { onConciergeOpen } from "../lib/conciergeBus.js";
import { paths } from "../lib/router.js";
import RouteLink from "./RouteLink.jsx";
import "./Concierge.css";

let seq = 0;
const nextId = () => `m${++seq}`;

const openingMessages = () => [
  { id: nextId(), from: "bot", lines: concierge.greetingEn, opening: true },
  { id: nextId(), from: "bot", lines: concierge.greetingHan },
  { id: nextId(), from: "bot", lines: [concierge.prompt], accent: true },
];

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
const trippedGuard = (value) => {
  const text = value.toLowerCase();
  return guardTerms.some((term) => text.includes(term));
};

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(openingMessages);
  const [stage, setStage] = useState("topic"); // topic → brief → done
  const [stepIndex, setStepIndex] = useState(0);
  const [brief, setBrief] = useState({});
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const timers = useRef([]);

  const step = stage === "brief" ? briefSteps[stepIndex] : null;

  /* ── plumbing ───────────────────────────────────────────── */
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /* Closing returns focus to the control that opened the panel. */
  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const push = useCallback((message) => {
    setMessages((current) => [...current, { id: nextId(), ...message }]);
  }, []);

  /* Bot replies land after a short beat so the exchange reads like a
     conversation rather than a data dump. */
  const reply = useCallback(
    (blocks, after) => {
      setTyping(true);
      const delay = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 60 : 520;
      const timer = setTimeout(() => {
        setTyping(false);
        blocks.forEach((block) => push(block));
        after?.();
      }, delay);
      timers.current.push(timer);
    },
    [push],
  );

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, typing, stage]);

  useEffect(() => onConciergeOpen(() => setOpen(true)), []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 240);
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  /* ── conversation moves ─────────────────────────────────── */
  const askStep = useCallback(
    (index) => {
      const next = briefSteps[index];
      if (!next) return;
      reply([
        {
          from: "bot",
          lines: [next.question],
          hint: next.hint,
        },
      ]);
    },
    [reply],
  );

  const startBrief = useCallback(
    (fromIndex = 0) => {
      setStage("brief");
      setStepIndex(fromIndex);
      askStep(fromIndex);
    },
    [askStep],
  );

  const finish = useCallback(() => {
    setStage("done");
    reply([
      { from: "bot", lines: ["这是你的 Project Brief："] },
      { from: "brief", lines: [] },
      {
        from: "bot",
        lines: [
          "把它发给我们，制片人会在一个工作日内回覆，并确认正式报价与条款。",
          concierge.quotaNote,
        ],
        note: true,
      },
    ]);
  }, [reply]);

  const advance = useCallback(
    (index) => {
      const nextIndex = index + 1;
      if (nextIndex < briefSteps.length) {
        setStepIndex(nextIndex);
        askStep(nextIndex);
        return;
      }
      finish();
    },
    [askStep, finish],
  );

  const chooseTopic = (topic) => {
    push({ from: "user", lines: [topic.label] });

    if (topic.projectType) {
      setBrief((current) => ({ ...current, projectType: topic.projectType }));
    }

    if (topic.id === "pricing") {
      reply([
        { from: "bot", lines: topic.reply },
        { from: "bot", lines: [concierge.quotaNote], note: true },
        { from: "bot", lines: ["要不要我帮你整理一份 Project Brief？"], accent: true },
      ]);
      setStage("topic");
      return;
    }

    if (topic.asksIdea) {
      reply([{ from: "bot", lines: topic.reply }], () => {
        setStage("idea");
      });
      return;
    }

    /* Project type is already known — skip straight to purpose. */
    reply([{ from: "bot", lines: topic.reply }], () => startBrief(1));
  };

  const answer = (value, { skipped = false } = {}) => {
    const text = value.trim();
    if (!text) return;

    push({ from: "user", lines: [text] });
    setDraft("");

    /* Commercial guardrail: acknowledge, never negotiate. */
    if (!skipped && trippedGuard(text)) {
      const currentIndex = stepIndex;
      const inBrief = stage === "brief";
      if (inBrief) setBrief((current) => ({ ...current, [briefSteps[currentIndex].key]: text }));
      reply([{ from: "bot", lines: concierge.guardReply, note: true }], () => {
        if (inBrief) advance(currentIndex);
        else if (stage === "idea") {
          setBrief((current) => ({ ...current, idea: text }));
          startBrief(0);
        }
      });
      return;
    }

    /* Free text before the brief starts becomes "The Idea". */
    if (stage !== "brief") {
      setBrief((current) => ({ ...current, idea: text }));
      reply([{ from: "bot", lines: ["收到，这个方向很有意思。接下来几个问题会很快。"] }], () =>
        startBrief(0),
      );
      return;
    }

    const current = briefSteps[stepIndex];

    if (current.validate === "email" && !skipped && !isEmail(text)) {
      reply([
        {
          from: "bot",
          lines: ["这个 email 看起来不太完整，可以再确认一次吗？"],
          hint: current.hint,
          note: true,
        },
      ]);
      return;
    }

    setBrief((prev) => ({ ...prev, [current.key]: skipped ? "—" : text }));
    advance(stepIndex);
  };

  const restart = () => {
    clearTimers();
    setMessages(openingMessages());
    setStage("topic");
    setStepIndex(0);
    setBrief({});
    setDraft("");
    setTyping(false);
    setCopied(false);
  };

  /* ── brief export ───────────────────────────────────────── */
  const filledGroups = useMemo(
    () =>
      briefGroups
        .map((group) => ({
          title: group.title,
          rows: group.keys
            .filter((key) => brief[key] && brief[key] !== "—")
            .map((key) => ({ key, label: briefLabels[key], value: brief[key] })),
        }))
        .filter((group) => group.rows.length > 0),
    [brief],
  );

  const briefText = useMemo(() => {
    const lines = ["GUOGAN BANHU 果甘半壶 · PROJECT BRIEF", ""];
    filledGroups.forEach((group) => {
      lines.push(group.title.toUpperCase());
      group.rows.forEach((row) => lines.push(`  ${row.label}: ${row.value}`));
      lines.push("");
    });
    lines.push(
      "Prepared with the studio concierge. Starting prices are published rates;",
      "the final quotation and terms are confirmed by Guogan Banhu Studio.",
    );
    return lines.join("\n");
  }, [filledGroups]);

  const mailHref = `mailto:${studio.email}?subject=${encodeURIComponent(
    "Project Brief · 果甘半壶",
  )}&body=${encodeURIComponent(briefText)}`;

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2400);
      timers.current.push(timer);
    } catch {
      setCopied(false);
      push({
        from: "bot",
        lines: ["浏览器不允许自动复制，请手动选取上面的 Brief 内容。"],
        note: true,
      });
    }
  };

  const showTopics = (stage === "topic" || stage === "idea") && !typing;
  const progress = stage === "brief" ? `${stepIndex + 1} / ${briefSteps.length}` : null;

  return (
    <>
      {/* Branded studio control — not a third-party chat bubble. */}
      <button
        className={`launcher${open ? " is-hidden" : ""}`}
        type="button"
        ref={launcherRef}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="concierge-panel"
        tabIndex={open ? -1 : 0}
      >
        <svg className="launcher__star" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1.5 13.8 9c.2.8.9 1.5 1.7 1.7L23 12.5l-7.5 1.8c-.8.2-1.5.9-1.7 1.7L12 23.5l-1.8-7.5c-.2-.8-.9-1.5-1.7-1.7L1 12.5l7.5-1.8c.8-.2 1.5-.9 1.7-1.7L12 1.5Z" />
        </svg>
        <span className="launcher__label">
          Ask <span className="launcher__han">果甘</span>
        </span>
        <span className="launcher__rule" aria-hidden="true" />
      </button>

      <section
        className={`cc${open ? " is-open" : ""}`}
        id="concierge-panel"
        role="dialog"
        aria-label={`${concierge.title} — ${concierge.subtitle}`}
        aria-hidden={!open}
        inert={!open}
      >
        <header className="cc__head">
          <div className="cc__head-titles">
            <p className="cc__title">
              <svg className="cc__star" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 1.5 13.8 9c.2.8.9 1.5 1.7 1.7L23 12.5l-7.5 1.8c-.8.2-1.5.9-1.7 1.7L12 23.5l-1.8-7.5c-.2-.8-.9-1.5-1.7-1.7L1 12.5l7.5-1.8c.8-.2 1.5-.9 1.7-1.7L12 1.5Z" />
              </svg>
              {concierge.title}
            </p>
            <p className="cc__subtitle">{concierge.subtitle}</p>
          </div>
          <div className="cc__head-actions">
            <button className="cc__icon" type="button" onClick={restart} title="Start over">
              <span className="cc__icon-label">Reset</span>
            </button>
            <button
              className="cc__icon"
              type="button"
              onClick={close}
              aria-label="Close concierge"
            >
              <span className="cc__close" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="cc__log" ref={logRef} aria-live="polite" aria-atomic="false">
          {messages.map((message) =>
            message.from === "brief" ? (
              <div className="cc__brief" key={message.id}>
                <p className="cc__brief-head">
                  Project Brief · 果甘半壶
                  <span>Draft</span>
                </p>
                {filledGroups.map((group) => (
                  <div className="cc__brief-group" key={group.title}>
                    <p className="cc__brief-group-title">{group.title}</p>
                    <dl>
                      {group.rows.map((row) => (
                        <div key={row.key}>
                          <dt>{row.label}</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
                <div className="cc__brief-actions">
                  <a className="cc__chip cc__chip--solid" href={mailHref}>
                    Email to studio
                  </a>
                  <a
                    className="cc__chip"
                    href={studio.whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    WhatsApp
                  </a>
                  <button className="cc__chip" type="button" onClick={copyBrief}>
                    {copied ? "Copied" : "Copy brief"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`cc__msg cc__msg--${message.from}${message.note ? " cc__msg--note" : ""}${
                  message.accent ? " cc__msg--accent" : ""
                }${message.opening ? " cc__msg--opening" : ""}`}
                key={message.id}
              >
                {message.lines.map((line, index) => (
                  <p key={`${message.id}-${index}`}>
                    {line.split("\n").map((part, partIndex) => (
                      <span key={`${message.id}-${index}-${partIndex}`}>{part}</span>
                    ))}
                  </p>
                ))}
                {message.hint ? <p className="cc__hint">{message.hint}</p> : null}
              </div>
            ),
          )}

          {typing ? (
            <div className="cc__msg cc__msg--bot cc__typing" aria-label="Concierge is typing">
              <span />
              <span />
              <span />
            </div>
          ) : null}
        </div>

        <div className="cc__foot">
          {progress ? (
            <p className="cc__progress">
              <span>Project Brief</span>
              <span className="cc__progress-bar" aria-hidden="true">
                <span style={{ width: `${((stepIndex + 1) / briefSteps.length) * 100}%` }} />
              </span>
              <span>{progress}</span>
            </p>
          ) : null}

          {showTopics ? (
            <div className="cc__chips" role="group" aria-label="Quick actions">
              {topics.map((topic) => (
                <button
                  className="cc__chip"
                  type="button"
                  key={topic.id}
                  onClick={() => chooseTopic(topic)}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          ) : null}

          {step?.options && !typing ? (
            <div className="cc__chips" role="group" aria-label={step.hint}>
              {step.options.map((option) => (
                <button
                  className="cc__chip"
                  type="button"
                  key={option}
                  onClick={() => answer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}

          {step?.optional && !typing ? (
            <div className="cc__chips">
              <button className="cc__chip cc__chip--quiet" type="button" onClick={() => answer("Skip", { skipped: true })}>
                Skip
              </button>
            </div>
          ) : null}

          {stage === "done" ? (
            <div className="cc__chips" role="group" aria-label="Next">
              <button className="cc__chip" type="button" onClick={restart}>
                New enquiry
              </button>
              <RouteLink
                className="cc__chip"
                to={paths.home}
                hash="#pricing"
                onNavigate={close}
              >
                See pricing
              </RouteLink>
            </div>
          ) : null}

          <form
            className="cc__form"
            onSubmit={(event) => {
              event.preventDefault();
              answer(draft);
            }}
          >
            <label className="cc__sr" htmlFor="cc-input">
              {step?.hint || "Message the concierge"}
            </label>
            <input
              id="cc-input"
              ref={inputRef}
              className="cc__input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={step?.placeholder || "写下你的想法…"}
              autoComplete="off"
              type={step?.validate === "email" ? "email" : "text"}
            />
            <button className="cc__send" type="submit" disabled={!draft.trim()}>
              <span>Send</span>
            </button>
          </form>

          <p className="cc__legal">{concierge.quotaNote}</p>
        </div>
      </section>
    </>
  );
}
