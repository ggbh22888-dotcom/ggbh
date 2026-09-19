import { useEffect, useState } from "react";
import "./ChapterRail.css";

/**
 * Chapter navigation for the case study: a hairline rail of numerals on
 * the right edge, which names the chapter you are reading and steps to
 * any other. Desktop only — below 1200px the inline chapter index does
 * the same job, so nothing here is hidden from keyboard users.
 */
export default function ChapterRail({ chapters }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (inView) setActive(inView.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav className="rail" aria-label="Chapters">
      <ol>
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              className={`rail__link${active === chapter.id ? " is-active" : ""}`}
              href={`#${chapter.id}`}
              aria-current={active === chapter.id ? "true" : undefined}
            >
              <span className="rail__no">{chapter.no}</span>
              <span className="rail__name">
                <span className="rail__title">{chapter.title}</span>
                <span className="rail__han">{chapter.han}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
