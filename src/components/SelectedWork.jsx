import Reveal from "./Reveal.jsx";
import RouteLink from "./RouteLink.jsx";
import WorkCard from "./WorkCard.jsx";
import { works } from "../content/site.js";
import "./SelectedWork.css";

export default function SelectedWork() {
  const feature = works.find((work) => work.featured) ?? works[0];
  const rest = works.filter((work) => work !== feature);

  return (
    <section className="works section section--edge" id="work" aria-labelledby="works-title">
      <div className="shell">
        <header className="works__head">
          <Reveal as="p" className="eyebrow eyebrow--index" data-index="03">
            Selected Work
          </Reveal>
          <Reveal as="h2" className="works__title display" id="works-title" delay={70}>
            Films we made, <em>frame by frame</em>
          </Reveal>
          <Reveal as="p" className="works__note" delay={120}>
            每一部作品都有它自己的故事线。
          </Reveal>
        </header>

        <Reveal className="works__feature">
          <p className="works__feature-flag">
            <span>Featured Production</span>
            <span>{feature.note}</span>
          </p>
          <WorkCard work={feature} size="feature" timecode="01:24:07:12" />
          {feature.published ? (
            <RouteLink className="btn works__feature-cta" to={`/work/${feature.slug}`}>
              <span>{feature.cta || "View Case Study"}</span>
            </RouteLink>
          ) : (
            <a className="btn works__feature-cta" href="#case-study">
              <span>Explore the Project</span>
            </a>
          )}
        </Reveal>

        <div className="works__grid">
          {rest.map((work, index) => (
            <Reveal className={`works__cell works__cell--${index + 1}`} key={work.slug} delay={index * 90}>
              <WorkCard work={work} timecode={["00:02:41:09", "00:17:47:00", "00:05:12:22"][index]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
