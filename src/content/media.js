/* ══════════════════════════════════════════════════════════════
   Media slots. Every value is intentionally empty for now —
   components fall back to generated, license-free cinematic
   placeholders, so no third-party imagery is ever shipped.

   Drop original Guogan Banhu masters into /public/media/ and fill
   in the paths below; no component needs to change. See
   /public/media/README.md for formats and sizes.
   ══════════════════════════════════════════════════════════════ */

export const showreel = {
  /* e.g. "/media/showreel-2026.mp4" — muted, looping, ≤ 8 MB */
  src: "",
  /* e.g. "/media/showreel-poster.jpg" — shows while the video loads */
  poster: "",
};

/* Keyed by the work `slug` in site.js. Each entry accepts a poster/still
   and an optional video; when `video` is present the card plays it muted
   and looping on hover (and offers a click-to-play control on touch),
   using `still` as its poster frame. */
export const workMedia = {
  "dear-goodbye": { still: "", video: "" },
  "first-meeting-ost": { still: "", video: "" },
  "bizsmile-547pm": { still: "", video: "" },
  "ah-hock": { still: "", video: "" },
};

/* The flagship 16:9 case-study hero — reserved for the final official
   《亲爱的，再见》 production still, with an optional trailer. */
export const caseHero = {
  still: "",
  video: "",
};

/* ══════════════════════════════════════════════════════════════
   《亲爱的，再见》DEAR, GOODBYE — flagship case-study media.

   Three official masters are connected here in the next revision.
   Until then every slot stays empty and the page renders its own
   generated placeholder; nothing is substituted, generated or
   sourced from stock.

     1. episode01  — Episode 01 master video
     2. keyArt     — Episode 01 official poster / key art
     3. commercial — branded / commercial spin-off video

   Video slots accept either a hosted file (`src`, e.g.
   "/media/dear-goodbye-ep01.mp4") or an external provider URL
   (`embed`, e.g. "https://player.vimeo.com/video/000000"). Both are
   loaded only after the visitor presses play.
   ══════════════════════════════════════════════════════════════ */
export const dearGoodbye = {
  /* 1 · Episode 01 master video */
  episode01: { src: "", embed: "", poster: "", captions: "" },

  /* 2 · Episode 01 official poster / key art (16:9 hero) */
  keyArt: { still: "" },

  /* 3 · Commercial / branded spin-off video */
  commercial: { src: "", embed: "", poster: "" },

  /* Character media, keyed by character slug in content/dearGoodbye.js.
     `portrait` is the official character portrait, `frame` a final film
     frame of the same character. */
  characters: {
    "lin-anran": { portrait: "", frame: "" },
    "gu-jingchuan": { portrait: "", frame: "" },
  },

  /* Visual development gallery, keyed by item `key`. */
  visualDevelopment: {
    "concept-art": "",
    "character-design": "",
    "location-design": "",
    costume: "",
    lighting: "",
    "key-frames": "",
    "poster-development": "",
    storyboard: "",
  },

  /* Poster & key art gallery, keyed by item `key`. */
  posters: {
    "series-main": "",
    episode: "",
    character: "",
    soundtrack: "",
    mv: "",
    social: "",
  },

  /* Soundtrack media, keyed by track `key`. */
  soundtrack: {
    "first-meeting": { audio: "", mv: "", cover: "" },
  },
};
