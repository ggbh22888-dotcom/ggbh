import CinematicFrame from "./CinematicFrame.jsx";
import RouteLink from "./RouteLink.jsx";
import { workMedia } from "../content/media.js";
import "./WorkCard.css";

/**
 * One portfolio entry: poster/still or video, title, format, year and a
 * case-study link. When `published` flips to true in site.js the card
 * becomes a link to its own case-study page at /work/<slug>; until then
 * it renders as an article that states where the case study stands.
 * Entries carrying a `classification` show it in place of format + year
 * — the flagship is an original IP before it is a format.
 */
export default function WorkCard({ work, size = "standard", ratio, timecode }) {
  const media = workMedia[work.slug] || {};
  const Tag = work.published ? RouteLink : "article";
  const tagProps = work.published
    ? { to: `/work/${work.slug}`, "aria-label": `${work.latin} — case study` }
    : {};
  const showLatin = work.latin && work.latin !== work.kind;

  return (
    <Tag className={`work work--${size}${work.published ? " work--link" : ""}`} {...tagProps}>
      <CinematicFrame
        className="frame--live work__frame"
        tone={work.tone}
        ratio={ratio || (size === "feature" ? "2.39 / 1" : "16 / 9")}
        src={media.still || ""}
        video={media.video || ""}
        alt={`${work.latin} — ${work.kind}`}
        eager={size === "feature"}
        timecode={timecode}
      />

      <div className="work__meta">
        <div className="work__titles">
          <h3 className="work__han">{work.han}</h3>
          {showLatin ? <p className="work__latin">{work.latin}</p> : null}
        </div>
        <dl className="work__facts">
          {work.classification ? (
            <div className="work__class">
              <dt>Classification</dt>
              <dd>
                {work.classification.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ) : (
            <>
              <div>
                <dt>Format</dt>
                <dd>{work.kind}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{work.year}</dd>
              </div>
            </>
          )}
          <div>
            <dt>Frame</dt>
            <dd>{work.frame}</dd>
          </div>
        </dl>
        {/* The feature card carries its CTA as a button underneath
            (see SelectedWork), so it does not repeat one here. */}
        {size === "feature" ? null : (
          <p className="work__status">
            {work.published ? (
              <span className="link-line">{work.cta || "View Case Study"}</span>
            ) : (
              <span className="work__pending">Case study page in production</span>
            )}
          </p>
        )}
      </div>
    </Tag>
  );
}
