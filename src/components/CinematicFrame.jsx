import { useCallback, useRef, useState } from "react";
import "./CinematicFrame.css";

/**
 * Letterboxed media slot — the single place the site renders film imagery.
 *
 * Renders, in order of what is supplied:
 *   1. `video` (muted, looping, poster = `src`) with a play control,
 *      previewing on hover on pointer devices;
 *   2. `src` as a still image;
 *   3. a generated cinematic placeholder (pure CSS, no third-party
 *      imagery) carrying the frame ratio and a "master pending" note.
 */
export default function CinematicFrame({
  tone = "burgundy",
  ratio = "2.39 / 1",
  label,
  caption,
  timecode,
  src = "",
  video = "",
  alt = "",
  eager = false,
  children,
  className = "",
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const start = useCallback(() => {
    const node = videoRef.current;
    if (!node) return;
    const request = node.play();
    if (request?.catch) request.catch(() => setPlaying(false));
    setPlaying(true);
  }, []);

  const stop = useCallback((rewind = true) => {
    const node = videoRef.current;
    if (!node) return;
    node.pause();
    if (rewind) node.currentTime = 0;
    setPlaying(false);
  }, []);

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const hoverProps = video
    ? {
        onMouseEnter: () => {
          if (!reducedMotion()) start();
        },
        onMouseLeave: () => stop(),
      }
    : {};

  return (
    <figure
      className={`frame frame--${tone}${className ? ` ${className}` : ""}`}
      style={{ "--frame-ratio": ratio }}
      {...hoverProps}
    >
      <div className="frame__stage">
        {video ? (
          <video
            ref={videoRef}
            className="frame__video"
            src={video}
            poster={src || undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-label={alt || label || undefined}
          />
        ) : src ? (
          <img
            className="frame__img"
            src={src}
            alt={alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
          />
        ) : (
          <div className="frame__gen" role="img" aria-label={alt || label || "Placeholder frame"}>
            <span className="frame__horizon" aria-hidden="true" />
            <span className="frame__beam" aria-hidden="true" />
            <span className="frame__grain" aria-hidden="true" />
          </div>
        )}

        <span className="frame__marks" aria-hidden="true" />

        {video ? (
          <button
            className={`frame__play${playing ? " is-playing" : ""}`}
            type="button"
            onClick={() => (playing ? stop(false) : start())}
          >
            <span className="frame__play-glyph" aria-hidden="true" />
            <span className="frame__play-label">{playing ? "Pause" : "Play"}</span>
          </button>
        ) : null}

        <div className="frame__meta" aria-hidden={src || video ? "true" : undefined}>
          {!src && !video ? <span className="frame__tag">Placeholder · Master pending</span> : null}
          {timecode ? <span className="frame__tc">{timecode}</span> : null}
        </div>

        {children}
      </div>

      {(label || caption) && (
        <figcaption className="frame__caption">
          {label ? <span className="frame__label">{label}</span> : null}
          {caption ? <span className="frame__sub">{caption}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}
