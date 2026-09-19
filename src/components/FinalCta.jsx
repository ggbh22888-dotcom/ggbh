import Reveal from "./Reveal.jsx";
import { studio } from "../content/site.js";
import { openConcierge } from "../lib/conciergeBus.js";
import "./FinalCta.css";

const chineseLines = ["也许你现在只有一句话、", "一个人物，", "或一个还没有说完的故事。"];

export default function FinalCta() {
  return (
    <section className="final section" id="contact" aria-labelledby="final-title">
      <span className="final__wash" aria-hidden="true" />
      <div className="shell final__inner">
        <Reveal as="p" className="eyebrow eyebrow--index" data-index="09">
          Start Here
        </Reveal>

        <Reveal as="h2" className="final__title display" id="final-title" delay={70}>
          Every film starts with an idea.
        </Reveal>

        <Reveal as="p" className="final__han han-display" delay={110}>
          {chineseLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span className="final__han-em">从这里开始。</span>
        </Reveal>

        <Reveal className="final__actions" delay={150}>
          <button className="btn btn--solid" type="button" onClick={() => openConcierge("idea")}>
            <span>Start Your Project</span>
          </button>
          <a className="btn" href={`mailto:${studio.email}`}>
            <span>{studio.email}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
