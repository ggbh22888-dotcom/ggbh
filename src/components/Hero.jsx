import { studio } from "../content/site.js";
import { showreel } from "../content/media.js";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__stage" aria-hidden="true">
        {showreel.src ? (
          <video
            className="hero__video"
            src={showreel.src}
            poster={showreel.poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="hero__plate">
            <span className="hero__glow" />
            <span className="hero__beam" />
            <span className="hero__dust" />
          </div>
        )}
        <span className="hero__vignette" />
        <span className="hero__bar hero__bar--top" />
        <span className="hero__bar hero__bar--bottom" />
      </div>

      <div className="hero__body shell">
        <p className="hero__slate">
          <span>Showreel 2026</span>
          <span className="hero__slate-dot" aria-hidden="true" />
          <span>Singapore</span>
          <span className="hero__slate-dot" aria-hidden="true" />
          <span>{showreel.src ? "Now Playing" : "Showreel Placeholder"}</span>
        </p>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__han">{studio.hanName}</span>
          <span className="hero__latin">
            <span>{studio.latinName}</span>
            <span className="hero__descriptor">{studio.descriptor}</span>
          </span>
        </h1>

        <div className="hero__statement">
          <p className="hero__han-lines">
            {studio.manifestoHan.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="hero__en-lines">
            {studio.manifestoEn.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <div className="hero__actions">
          <a className="btn" href="#work">
            <span>View Our Work</span>
          </a>
          <a className="btn btn--solid" href="#contact">
            <span>Start a Project</span>
          </a>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to introduction">
        <span className="hero__scroll-text">Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
