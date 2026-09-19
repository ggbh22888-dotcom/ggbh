# Legacy 八字 (BaZi) site

The previous GGHB fortune-telling site, kept for reference after the
studio redesign. Nothing in `legacy/` is imported by the live build.

- `bazi-app/App.src.jsx` — the app that used to render at `src/App.jsx`
- `bazi-app/App.jsx`, `bazi-app/main.jsx`, `bazi-app/index.css` — the
  duplicate root-level copies used for the manual GitHub upload flow
- `bazi-app/generate-reading.js` — root-level copy of the AI reading function

The two deployed functions in `netlify/functions/` (`generate-reading.js`
and `send-report.js`) were left in place and untouched; they are no longer
called by the site and can be removed once you are sure the BaZi flow is
retired.
