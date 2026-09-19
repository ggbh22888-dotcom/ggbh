import { useEffect, useRef, useState } from "react";
import CinematicFrame from "../components/CinematicFrame.jsx";
import CharacterCard from "../components/CharacterCard.jsx";
import ChapterRail from "../components/ChapterRail.jsx";
import FilmPlayer from "../components/FilmPlayer.jsx";
import Reveal from "../components/Reveal.jsx";
import RouteLink from "../components/RouteLink.jsx";
import {
  behindTheScenes,
  behindTheScenesNote,
  brand,
  chapters,
  characterNote,
  characterStatement,
  characters,
  cinematography,
  closing,
  collection,
  film,
  ipArc,
  musicCategories,
  musicNote,
  posterGallery,
  soundtrack,
  story,
  universe,
  visualDevelopment,
} from "../content/dearGoodbye.js";
import { dearGoodbye } from "../content/media.js";
import { paths } from "../lib/router.js";
import "./DearGoodbye.css";

/* Chinese copy is authored with line breaks; keep them. */
const Lines = ({ text }) =>
  text.split("\n").map((line, index) => <span key={index}>{line}</span>);

function ChapterHead({ chapter, title, han, children }) {
  return (
    <header className="cs__head">
      <Reveal as="p" className="cs__no">
        <span>{chapter.no}</span>
      </Reveal>
      <Reveal as="h2" className="cs__title" id={`${chapter.id}-title`} delay={60}>
        <span className="cs__title-en">{title || chapter.title}</span>
        <span className="cs__title-han">{han || chapter.han}</span>
      </Reveal>
      {children}
    </header>
  );
}

/* One soundtrack entry. The controls are real but stay disabled until
   the track is connected in src/content/media.js — nothing here
   pretends to play media that does not exist yet. */
function SoundtrackRow({ track }) {
  const media = dearGoodbye.soundtrack[track.key] || {};
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const node = audioRef.current;
    if (!node) return;
    if (playing) node.pause();
    else node.play()?.catch(() => setPlaying(false));
  };

  return (
    <article className="track">
      <p className="track__no">{track.no}</p>
      <div className="track__titles">
        <h3 className="track__han">{track.han}</h3>
        <p className="track__latin">{track.latin}</p>
      </div>
      <dl className="track__facts">
        <div>
          <dt>Type</dt>
          <dd>{track.kind}</dd>
        </div>
        <div>
          <dt>Style</dt>
          <dd>{track.style}</dd>
        </div>
      </dl>
      <div className="track__actions">
        {track.actions.map((action) =>
          action === "Play" && media.audio ? (
            <button className="track__act is-live" type="button" key={action} onClick={toggle}>
              {playing ? "Pause" : "Play"}
            </button>
          ) : action === "Watch MV" && media.mv ? (
            <a className="track__act is-live" href={media.mv} key={action}>
              {action}
            </a>
          ) : (
            <button className="track__act" type="button" key={action} disabled>
              {action}
            </button>
          ),
        )}
      </div>
      {media.audio ? (
        <audio
          ref={audioRef}
          src={media.audio}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <p className="track__pending">Audio and MV connect once the masters are delivered</p>
      )}
    </article>
  );
}

export default function DearGoodbye() {
  const [
    cStory,
    cCharacter,
    cVisual,
    cCinema,
    cWatch,
    cMusic,
    cPoster,
    cCollection,
    cBrand,
    cBts,
    cUniverse,
  ] = chapters;

  useEffect(() => {
    const previous = document.title;
    document.title = `${film.han} Dear, Goodbye · 果甘半壶 GUOGAN BANHU`;
    return () => {
      document.title = previous;
    };
  }, []);

  /* A hard load of /work/dear-goodbye#chapter-music arrives before the
     chapters exist, so place the viewport once they do. */
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <>
      <ChapterRail chapters={chapters} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="cs cs--hero" id="case-top" aria-labelledby="cs-title">
        <div className="shell cs__hero-grid">
          <div className="cs__hero-copy">
            <Reveal as="p" className="cs__flag">
              <RouteLink className="cs__back" to={paths.home} hash="#work">
                Selected Work
              </RouteLink>
              <span className="cs__flag-sep" aria-hidden="true" />
              <span>Flagship Case Study</span>
            </Reveal>

            <h1 className="cs__hero-title" id="cs-title">
              <Reveal as="span" className="cs__hero-han" delay={60}>
                {film.han}
              </Reveal>
              <Reveal as="span" className="cs__hero-latin" delay={120}>
                {film.latin}
              </Reveal>
            </h1>

            <Reveal as="p" className="cs__hero-positioning" delay={160}>
              {film.positioning}
            </Reveal>

            <Reveal className="cs__tagline" delay={200}>
              <p className="cs__tagline-han">{film.taglineHan}</p>
              <p className="cs__tagline-en">{film.taglineEn}</p>
            </Reveal>

            <Reveal as="ul" className="cs__meta" delay={240}>
              {film.meta.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Reveal>

            <Reveal className="cs__hero-actions" delay={280}>
              <a className="btn btn--solid" href={`#${cWatch.id}`}>
                <span>Watch Episode 01</span>
              </a>
              <a className="btn" href={`#${cStory.id}`}>
                <span>Explore the Project</span>
              </a>
            </Reveal>
          </div>

          {/* Official Episode 01 poster lands in this container. */}
          <Reveal className="cs__hero-media" delay={120}>
            <CinematicFrame
              className="frame--live frame--fixed cs__key-art"
              tone="burgundy"
              ratio="16 / 9"
              src={dearGoodbye.keyArt.still}
              alt={`${film.latin} — official key art`}
              eager
              timecode="EP 01"
              label="Key Art · 主视觉"
              caption={film.keyArtCaption}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Chapter index + IP arc ───────────────────────────── */}
      <section className="cs cs--index" id="chapter-index" aria-label="Chapter index">
        <div className="shell">
          <Reveal as="p" className="cs__index-label">
            Chapters
          </Reveal>
          <ol className="cs__index">
            {chapters.map((chapter, index) => (
              <Reveal as="li" key={chapter.id} delay={index * 30}>
                <a className="cs__index-link" href={`#${chapter.id}`}>
                  <span className="cs__index-no">{chapter.no}</span>
                  <span className="cs__index-title">{chapter.title}</span>
                  <span className="cs__index-han">{chapter.han}</span>
                </a>
              </Reveal>
            ))}
          </ol>

          <Reveal as="p" className="cs__arc-label" delay={80}>
            One story, developed all the way through
          </Reveal>
          <Reveal as="ol" className="cs__arc" delay={120}>
            {ipArc.map((stage) => (
              <li key={stage}>{stage}</li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── I · The Story ────────────────────────────────────── */}
      <section
        className="cs section cs--story"
        id={cStory.id}
        aria-labelledby={`${cStory.id}-title`}
      >
        <div className="shell cs__story-grid">
          <ChapterHead chapter={cStory} />
          <div className="cs__story-body">
            {story.han.map((block, index) => (
              <Reveal as="p" className="cs__story-han" key={index} delay={index * 90}>
                <Lines text={block} />
              </Reveal>
            ))}
            <Reveal className="cs__story-en" delay={280}>
              {story.en.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── II · Character World ─────────────────────────────── */}
      <section
        className="cs section cs--character"
        id={cCharacter.id}
        aria-labelledby={`${cCharacter.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cCharacter}>
            <Reveal as="p" className="cs__lede" delay={110}>
              {characterNote}
            </Reveal>
          </ChapterHead>

          <Reveal as="p" className="cs__statement" delay={80}>
            {characterStatement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>

          <div className="cs__cast">
            {characters.map((character, index) => (
              <Reveal key={character.slug} delay={index * 80}>
                <CharacterCard character={character} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── III · Visual Development ─────────────────────────── */}
      <section
        className="cs section cs--visual"
        id={cVisual.id}
        aria-labelledby={`${cVisual.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cVisual}>
            <Reveal as="p" className="cs__lede" delay={110}>
              概念、角色、场景、造型、灯光与分镜，全部在开拍前完成。
            </Reveal>
          </ChapterHead>

          <div className="cs__gallery">
            {visualDevelopment.map((item, index) => (
              <Reveal
                className={`cs__tile cs__tile--${item.key}`}
                key={item.key}
                delay={(index % 3) * 70}
              >
                <CinematicFrame
                  className="frame--live frame--fixed"
                  tone={item.tone}
                  ratio={item.ratio}
                  src={dearGoodbye.visualDevelopment[item.key] || ""}
                  alt={`${item.label} — Dear, Goodbye`}
                  label={item.label}
                  caption={item.han}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── IV · AI Cinematography ───────────────────────────── */}
      <section
        className="cs section cs--cinema"
        id={cCinema.id}
        aria-labelledby={`${cCinema.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cCinema} />

          <Reveal as="p" className="cs__statement cs__statement--wide" delay={80}>
            {cinematography.statement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>

          <ol className="cs__pipe">
            {cinematography.pipeline.map((stage, index) => (
              <Reveal as="li" className="cs__pipe-step" key={stage.step} delay={index * 60}>
                <span className="cs__pipe-node" aria-hidden="true" />
                <span className="cs__pipe-no">{String(index + 1).padStart(2, "0")}</span>
                <span className="cs__pipe-name">{stage.step}</span>
                <span className="cs__pipe-han">{stage.han}</span>
              </Reveal>
            ))}
          </ol>

          <div className="cs__direction">
            <Reveal as="p" className="cs__direction-label">
              {cinematography.directionLabel}
            </Reveal>
            <div className="cs__direction-grid">
              {cinematography.direction.map((item, index) => (
                <Reveal as="article" className="cs__craft" key={item.label} delay={index * 60}>
                  <h3 className="cs__craft-title">{item.label}</h3>
                  <p className="cs__craft-han">{item.han}</p>
                  <p className="cs__craft-note">{item.note}</p>
                </Reveal>
              ))}
            </div>
            <Reveal as="p" className="cs__note" delay={80}>
              {cinematography.note}
              <span className="cs__note-han">{cinematography.noteHan}</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── V · Watch Episode 01 ─────────────────────────────── */}
      <section
        className="cs section cs--watch"
        id={cWatch.id}
        aria-labelledby={`${cWatch.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cWatch}>
            <Reveal as="p" className="cs__episode" delay={110}>
              Episode 01
            </Reveal>
          </ChapterHead>

          <Reveal delay={60}>
            <FilmPlayer
              media={dearGoodbye.episode01}
              tone="burgundy"
              eyebrow="Episode 01"
              han={film.han}
              latin={film.latin}
              meta={film.episodeLine}
              label="Episode 01"
              caption="16 : 9 player reserved for the official Episode 01 master"
              timecode="EP 01"
              cta="Watch Film"
              pendingNote="Episode 01 master connects here · 正片母带待接入"
              creditLabel={film.creditLabel}
              creditStudio={film.creditStudio}
            />
          </Reveal>
        </div>
      </section>

      {/* ── VI · Original Music ──────────────────────────────── */}
      <section
        className="cs section cs--music"
        id={cMusic.id}
        aria-labelledby={`${cMusic.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cMusic}>
            <Reveal as="p" className="cs__lede" delay={110}>
              {musicNote}
            </Reveal>
          </ChapterHead>

          <ul className="cs__music-cats">
            {musicCategories.map((category, index) => (
              <Reveal as="li" key={category.label} delay={index * 50}>
                <span className="cs__music-en">{category.label}</span>
                <span className="cs__music-han">{category.han}</span>
              </Reveal>
            ))}
          </ul>

          <div className="cs__tracks">
            <Reveal as="p" className="cs__tracks-label">
              Soundtrack Archive
            </Reveal>
            {soundtrack.map((track) => (
              <Reveal key={track.key} delay={60}>
                <SoundtrackRow track={track} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VII · Poster & Key Art ───────────────────────────── */}
      <section
        className="cs section cs--posters"
        id={cPoster.id}
        aria-labelledby={`${cPoster.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cPoster}>
            <Reveal as="p" className="cs__lede" delay={110}>
              每一张视觉都为同一个故事服务。官方海报交付后接入以下位置。
            </Reveal>
          </ChapterHead>

          <div className="cs__posters">
            {posterGallery.map((item, index) => (
              <Reveal className="cs__poster" key={item.key} delay={(index % 3) * 70}>
                <CinematicFrame
                  className="frame--live frame--fixed"
                  tone={item.tone}
                  ratio={item.ratio}
                  src={dearGoodbye.posters[item.key] || ""}
                  alt={`${item.label} — Dear, Goodbye`}
                  label={item.label}
                  caption={item.han}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIII · IP & Merchandise ──────────────────────────── */}
      <section
        className="cs section cs--collection"
        id={cCollection.id}
        aria-labelledby={`${cCollection.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cCollection} title={collection.title} han={collection.subtitle}>
            <Reveal as="p" className="cs__badge" delay={110}>
              {collection.status}
            </Reveal>
          </ChapterHead>

          <div className="cs__collection">
            <ul className="cs__goods">
              {collection.items.map((item, index) => (
                <Reveal as="li" className="cs__good" key={item.label} delay={(index % 4) * 50}>
                  <span className="cs__good-en">{item.label}</span>
                  <span className="cs__good-han">{item.han}</span>
                </Reveal>
              ))}
            </ul>
            <Reveal className="cs__collection-note" delay={80}>
              <p className="cs__note-han cs__note-han--lead">{collection.note}</p>
              <p className="cs__note">{collection.noteEn}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── IX · Brand Integration ───────────────────────────── */}
      <section
        className="cs section cs--brand"
        id={cBrand.id}
        aria-labelledby={`${cBrand.id}-title`}
      >
        <div className="shell">
          <header className="cs__head cs__head--brand">
            <Reveal as="p" className="cs__no">
              <span>{cBrand.no}</span>
              <span className="cs__no-label">
                {cBrand.title} · {cBrand.han}
              </span>
            </Reveal>
            <Reveal as="h2" className="cs__brand-title" id={`${cBrand.id}-title`} delay={60}>
              {brand.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </Reveal>
            <Reveal as="p" className="cs__brand-han" delay={110}>
              {brand.han.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </Reveal>
          </header>

          <Reveal className="cs__flow" delay={80}>
            <span className="cs__flow-plate">{brand.flow.from}</span>
            <span className="cs__flow-arrow" aria-hidden="true" />
            <span className="cs__flow-plate cs__flow-plate--end">{brand.flow.to}</span>
          </Reveal>

          <ol className="cs__options">
            {brand.options.map((option, index) => (
              <Reveal as="li" className="cs__option" key={option.no} delay={index * 55}>
                <span className="cs__option-no">{option.no}</span>
                <span className="cs__option-body">
                  <span className="cs__option-title">{option.label}</span>
                  <span className="cs__option-han">{option.han}</span>
                  <span className="cs__option-note">{option.note}</span>
                </span>
              </Reveal>
            ))}
          </ol>

          {/* Second media container: the official branded spin-off. */}
          <Reveal className="cs__spinoff" delay={70}>
            <FilmPlayer
              media={dearGoodbye.commercial}
              tone="night"
              eyebrow={brand.spinoff.label}
              han={brand.spinoff.han}
              latin="Dear, Goodbye × Brand"
              meta="Branded film · 2026"
              label={brand.spinoff.label}
              caption={brand.spinoff.caption}
              cta="Watch Film"
              pendingNote="Branded spin-off film connects here · 品牌衍生影片待接入"
            />
          </Reveal>
        </div>
      </section>

      {/* ── X · Behind The Scenes ────────────────────────────── */}
      <section className="cs section cs--bts" id={cBts.id} aria-labelledby={`${cBts.id}-title`}>
        <div className="shell">
          <ChapterHead chapter={cBts} />

          <ol className="cs__stages">
            {behindTheScenes.map((stage, index) => (
              <Reveal as="li" className="cs__stage" key={stage.no} delay={(index % 5) * 50}>
                <span className="cs__stage-no">{stage.no}</span>
                <span className="cs__stage-name">{stage.label}</span>
                <span className="cs__stage-han">{stage.han}</span>
              </Reveal>
            ))}
          </ol>

          <Reveal as="p" className="cs__note-han" delay={80}>
            {behindTheScenesNote}
          </Reveal>
        </div>
      </section>

      {/* ── XI · The IP Universe ─────────────────────────────── */}
      <section
        className="cs section cs--universe"
        id={cUniverse.id}
        aria-labelledby={`${cUniverse.id}-title`}
      >
        <div className="shell">
          <ChapterHead chapter={cUniverse} />

          <Reveal as="p" className="cs__statement cs__statement--wide" delay={80}>
            {universe.statement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>

          <div className="cs__universe">
            <Reveal className="cs__centre" delay={60}>
              <p className="cs__centre-han">{universe.centre.han}</p>
              <p className="cs__centre-latin">{universe.centre.latin}</p>
              <p className="cs__centre-label">Story World</p>
            </Reveal>

            <ul className="cs__nodes">
              {universe.nodes.map((node, index) => (
                <Reveal as="li" className="cs__node" key={node.label} delay={(index % 4) * 55}>
                  <span className="cs__node-en">{node.label}</span>
                  <span className="cs__node-han">{node.han}</span>
                  <span className="cs__node-state">{node.state}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="cs cs--closing section" id="case-start" aria-labelledby="case-start-title">
        <span className="cs__closing-wash" aria-hidden="true" />
        <div className="shell cs__closing-inner">
          <Reveal as="h2" className="cs__closing-title" id="case-start-title">
            {closing.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>
          <Reveal as="p" className="cs__closing-han" delay={80}>
            {closing.han.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </Reveal>
          <Reveal className="cs__closing-actions" delay={140}>
            <RouteLink className="btn btn--solid" to={paths.home} hash="#contact">
              <span>{closing.cta}</span>
            </RouteLink>
            <RouteLink className="btn" to={paths.home} hash="#work">
              <span>More Work</span>
            </RouteLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
