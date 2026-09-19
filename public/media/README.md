# Studio media assets

Drop original Guogan Banhu masters in this folder, then point
`src/content/media.js` at them. Nothing else in the code needs to change.

| Slot | Suggested file | Notes |
| --- | --- | --- |
| Hero showreel | `showreel.mp4` | H.264, muted, seamless loop, ≤ 8 MB, 1920×1080 or wider |
| Hero poster | `showreel-poster.jpg` | First frame; shows while the video loads |
| Work stills | `dear-goodbye-still.jpg`, `first-meeting-ost-still.jpg`, … | 2.39:1 for the feature, 16:9 for the grid, ~1800 px wide, JPG/WebP |

Until a slot is filled the site renders a generated, license-free
cinematic placeholder, so no third-party imagery is ever shipped.

Example once the showreel exists:

```js
// src/content/media.js
export const showreel = {
  src: "/media/showreel.mp4",
  poster: "/media/showreel-poster.jpg",
};

export const stills = {
  "dear-goodbye": { still: "/media/dear-goodbye-still.jpg" },
};
```

## 《亲爱的，再见》DEAR, GOODBYE — official masters

The case study at `/work/dear-goodbye` is built around three official
assets that the studio connects later. They have no substitutes: no
AI-generated stand-ins, no stock media, no placeholder footage from
anywhere else. Until they arrive each container states that the master is
pending, and the page needs no structural change when they land.

| # | Asset | Slot in `src/content/media.js` | Suggested file |
| --- | --- | --- | --- |
| 1 | Episode 01 master video | `dearGoodbye.episode01` | `dear-goodbye-ep01.mp4` (16:9, H.264) |
| 2 | Episode 01 official poster | `dearGoodbye.keyArt.still` | `dear-goodbye-ep01-poster.jpg` (16:9 key art) |
| 3 | Commercial / branded spin-off video | `dearGoodbye.commercial` | `dear-goodbye-brand-film.mp4` (16:9) |

Both video slots take either a hosted file or an external provider, and
neither loads a byte until the visitor presses play:

```js
// hosted on Netlify
episode01: {
  src: "/media/dear-goodbye-ep01.mp4",
  poster: "/media/dear-goodbye-ep01-poster.jpg",
  captions: "/media/dear-goodbye-ep01.zh.vtt",   // optional
},

// or on an external provider — an embed URL, not a watch page
episode01: { embed: "https://player.example.com/embed/xxxx" },
```

The same file also carries the secondary slots — character portraits and
final film frames, the visual-development gallery, the poster gallery and
the soundtrack (`audio`, `mv`, `cover`). Each is keyed by the slug or
`key` used in `src/content/dearGoodbye.js`, so filling one in is a
one-line change. Portrait, poster and square slots keep their own aspect
ratio at every screen size; wide stills open up on narrow screens.
