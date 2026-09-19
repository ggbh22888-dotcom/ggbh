import Reveal from "./Reveal.jsx";
import CinematicFrame from "./CinematicFrame.jsx";
import RouteLink from "./RouteLink.jsx";
import { works } from "../content/site.js";
import { chapters } from "../content/dearGoodbye.js";
import { caseHero } from "../content/media.js";
import { paths } from "../lib/router.js";
import "./CaseStudy.css";

export default function CaseStudy() {
  const film = works.find((work) => work.slug === "dear-goodbye") ?? works[0];

  return (
    <section className="case section section--edge" id="case-study" aria-labelledby="case-title">
      <div className="shell">
        <header className="case__head">
          <div className="case__titles">
            <Reveal as="p" className="eyebrow eyebrow--index" data-index="07">
              Case Study
            </Reveal>
            <Reveal as="h2" className="case__title" id="case-title" delay={70}>
              <span className="case__han">{film.han}</span>
              <span className="case__latin">{film.latin}</span>
            </Reveal>
            <Reveal as="p" className="case__flag" delay={110}>
              A Guogan Banhu Original Production
            </Reveal>
          </div>

          <Reveal className="case__facts" delay={140}>
            <dl>
              <div>
                <dt>Format</dt>
                <dd>{film.kind}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{film.year}</dd>
              </div>
              <div>
                <dt>Production</dt>
                <dd>Story, screenplay, characters, cinematography and soundtrack in-house</dd>
              </div>
            </dl>
            <p className="case__blurb">一场关于告别的短剧。从第一句对白到最后一个音符，都由工作室原创。</p>
          </Reveal>
        </header>

        {/* Flagship 16:9 area, reserved for the final official still. */}
        <Reveal className="case__hero" delay={90}>
          <CinematicFrame
            className="frame--live case__frame"
            tone="burgundy"
            ratio="16 / 9"
            src={caseHero.still}
            video={caseHero.video}
            alt={`${film.latin} — official production still`}
            timecode="01:24:07:12"
            label="Official production still"
            caption="16 : 9 hero media reserved for the final master"
          />
        </Reveal>

        <div className="case__lower">
          <div className="case__chapters">
            <Reveal as="p" className="case__chapters-label">
              Chapter Index
            </Reveal>
            <ol className="chapters">
              {chapters.map((chapter, index) => (
                <Reveal as="li" className="chapter" key={chapter.no} delay={index * 45}>
                  <RouteLink
                    className="chapter__link"
                    to={paths.dearGoodbye}
                    hash={`#${chapter.id}`}
                  >
                    <span className="chapter__no">{chapter.no}</span>
                    <span className="chapter__body">
                      <span className="chapter__title">{chapter.title}</span>
                      <span className="chapter__han">{chapter.han}</span>
                    </span>
                  </RouteLink>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal className="case__cta" delay={90}>
            <p className="case__cta-line">
              完整案例研究：故事、角色、分镜、摄影、配乐与幕后。
            </p>
            <RouteLink className="btn btn--solid" to={paths.dearGoodbye}>
              <span>Explore the Project</span>
            </RouteLink>
            <p className="case__cta-note">
              Eleven chapters · Story, characters, cinematography, music and IP
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
