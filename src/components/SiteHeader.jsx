import { useEffect, useState } from "react";
import { nav, studio } from "../content/site.js";
import RouteLink from "./RouteLink.jsx";
import { paths } from "../lib/router.js";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [lifted, setLifted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    /* The drawer owns the screen while open: lock scroll and let the
       concierge launcher step aside (see Concierge.css). */
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) document.body.dataset.menu = "open";
    else delete document.body.dataset.menu;
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.menu;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className={`masthead${lifted ? " is-lifted" : ""}`}>
      <div className="masthead__inner shell">
        <RouteLink
          className="mark"
          to={paths.home}
          hash="#top"
          onNavigate={() => setMenuOpen(false)}
        >
          <span className="mark__han">{studio.hanName}</span>
          <span className="mark__latin">
            {studio.latinName}
            <span className="mark__sep" aria-hidden="true">
              /
            </span>
            {studio.descriptor}
          </span>
        </RouteLink>

        <nav className="masthead__nav" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <RouteLink to={paths.home} hash={item.href}>
                  {item.label}
                </RouteLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="masthead__actions">
          <RouteLink className="btn btn--sm" to={paths.home} hash="#contact">
            <span>Start a Project</span>
          </RouteLink>
          <button
            className="burger"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="burger__label">{menuOpen ? "Close" : "Menu"}</span>
            <span className={`burger__bars${menuOpen ? " is-x" : ""}`} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`drawer${menuOpen ? " is-open" : ""}`}
        inert={!menuOpen}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item, index) => (
              <li key={item.href} style={{ "--i": index }}>
                <RouteLink
                  to={paths.home}
                  hash={item.href}
                  onNavigate={() => setMenuOpen(false)}
                >
                  <span className="drawer__no">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </RouteLink>
              </li>
            ))}
          </ul>
        </nav>
        <RouteLink
          className="btn btn--solid drawer__cta"
          to={paths.home}
          hash="#contact"
          onNavigate={() => setMenuOpen(false)}
        >
          <span>Start a Project</span>
        </RouteLink>
        <p className="drawer__foot">{studio.location}</p>
      </div>
    </header>
  );
}
