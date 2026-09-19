import Reveal from "./Reveal.jsx";
import { pipeline } from "../content/site.js";
import "./Process.css";

export default function Process() {
  return (
    <section className="process section section--edge" id="process" aria-labelledby="process-title">
      <div className="shell">
        <header className="process__head">
          <div>
            <Reveal as="p" className="eyebrow eyebrow--index" data-index="05">
              Production Process
            </Reveal>
            <Reveal as="h2" className="process__title" id="process-title" delay={70}>
              <span>One studio.</span>
              <span className="process__title-em">From first idea to final frame.</span>
            </Reveal>
          </div>
          <Reveal as="p" className="process__aside" delay={110}>
            八个阶段，一个团队。
            <span>Direction, writing, character, image, sound and finishing stay under one roof.</span>
          </Reveal>
        </header>

        <ol className="pipe">
          {pipeline.map((stage, index) => (
            <Reveal as="li" className="pipe__step" key={stage.step} delay={index * 70}>
              <span className="pipe__node" aria-hidden="true" />
              <span className="pipe__no">{String(index + 1).padStart(2, "0")}</span>
              <span className="pipe__name">{stage.step}</span>
              <span className="pipe__han">{stage.han}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
