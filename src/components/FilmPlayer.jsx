import { useState } from "react";
import CinematicFrame from "./CinematicFrame.jsx";
import "./FilmPlayer.css";

/**
 * Premium film container for the case study.
 *
 * Nothing loads until the visitor presses play: idle state is the poster
 * (or the studio placeholder frame), and only then is a hosted file
 * (`media.src`) or an external provider (`media.embed`) mounted. When
 * neither exists the container states that the master is pending rather
 * than substituting any other footage.
 */
export default function FilmPlayer({
  media = {},
  tone = "burgundy",
  ratio = "16 / 9",
  eyebrow,
  han,
  latin,
  meta,
  label,
  caption,
  cta = "Watch Film",
  timecode,
  pendingNote,
  creditLabel,
  creditStudio,
}) {
  const [active, setActive] = useState(false);
  const playable = Boolean(media.src || media.embed);
  const title = [han, latin].filter(Boolean).join(" ");

  return (
    <div className={`player player--${tone}`}>
      {active && media.embed ? (
        <div className="player__live" style={{ "--frame-ratio": ratio }}>
          <iframe
            className="player__embed"
            src={media.embed}
            title={title || "Film"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : active && media.src ? (
        <div className="player__live" style={{ "--frame-ratio": ratio }}>
          {/* A caption track is attached as soon as the master supplies one. */}
          <video
            className="player__video"
            src={media.src}
            poster={media.poster || undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            {media.captions ? (
              <track kind="captions" src={media.captions} srcLang="zh" label="中文" default />
            ) : null}
          </video>
        </div>
      ) : (
        <CinematicFrame
          className="player__frame frame--fixed"
          tone={tone}
          ratio={ratio}
          src={media.poster || media.still || ""}
          alt={title ? `${title} — key art` : "Key art"}
          label={label}
          caption={caption}
          timecode={timecode}
        >
          {playable ? (
            <button className="player__play" type="button" onClick={() => setActive(true)}>
              <span className="player__play-mark" aria-hidden="true" />
              <span className="player__play-label">{cta}</span>
            </button>
          ) : (
            <span className="player__standby" aria-hidden="true">
              <span className="player__standby-mark" />
            </span>
          )}
        </CinematicFrame>
      )}

      <div className="player__bar">
        <div className="player__titles">
          {eyebrow ? <p className="player__eyebrow">{eyebrow}</p> : null}
          {han ? <p className="player__han">{han}</p> : null}
          {latin ? <p className="player__latin">{latin}</p> : null}
          {meta ? <p className="player__meta">{meta}</p> : null}
        </div>

        <div className="player__side">
          {playable ? (
            <button className="btn btn--sm player__cta" type="button" onClick={() => setActive(true)}>
              <span>{cta}</span>
            </button>
          ) : (
            <p className="player__pending">{pendingNote}</p>
          )}
          {creditStudio ? (
            <p className="player__credit">
              <span className="player__credit-label">{creditLabel}</span>
              <span className="player__credit-studio">{creditStudio}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
