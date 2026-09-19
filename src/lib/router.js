/* ══════════════════════════════════════════════════════════════
   A 40-line router. The site has two documents — the home page and
   the Dear, Goodbye case study — so it needs history, not a routing
   library. Netlify already rewrites every path to index.html, so a
   hard load of /work/dear-goodbye works on its own; this only makes
   in-site navigation instant.
   ══════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";

export const paths = {
  home: "/",
  dearGoodbye: "/work/dear-goodbye",
};

const clean = (path) => (path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path);

export const currentPath = () =>
  typeof window === "undefined" ? paths.home : clean(window.location.pathname);

const scrollTo = (hash) => {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  const target = document.querySelector(hash);
  if (!target) return;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
};

/** Navigate within the site, then place the viewport. */
export function navigate(to, hash = "") {
  const from = currentPath();
  window.history.pushState({}, "", `${to}${hash}`);
  if (from !== to) {
    window.dispatchEvent(new PopStateEvent("popstate"));
    /* Let the new page paint before looking for the anchor. */
    requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(hash)));
    return;
  }
  scrollTo(hash);
}

/** The current in-site path, kept in step with back/forward. */
export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return path;
}

/** True for clicks the browser should keep handling itself. */
export const isModifiedClick = (event) =>
  event.defaultPrevented ||
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey;
