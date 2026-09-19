# 果甘半壶 · GUOGAN BANHU AI VIDEO STUDIO

Official website for a Singapore-based boutique AI cinematic storytelling
and video production studio.

> 我们不生产 AI 视频。我们用 AI 拍故事。
> We don't just make AI videos. We tell stories with AI.

React + Vite, deployed on Netlify. Two documents are built: the home page
with its design system (V02), and the flagship case study
《亲爱的，再见》DEAR, GOODBYE at `/work/dear-goodbye` (V03), which reuses the
same components. The remaining inner pages (full services, studio) reuse
them again when they are built.

Navigation is Work · Services · Process · Pricing · About · Contact, each
a section of the home page. Header links carry the path as well as the
anchor, so they work from the case study too.

## Run it locally

```bash
npm install
npm run dev        # Vite on :5173
# or, with Netlify features emulated:
netlify dev --port 8889
```

## Structure

```
index.html                  document head, fonts, social meta
src/
  main.jsx                  entry
  App.jsx                   route switch + page composition
  pages/DearGoodbye.jsx     the flagship case study, chapters I–XI
  index.css                 imports the two style layers
  styles/
    tokens.css              colour, type, rhythm, motion — edit here first
    base.css                reset, global type, .btn / .section / .reveal
  components/               one component + one stylesheet each
  content/
    site.js                 all site copy and data (nav, work, services,
                            pipeline, pricing, chapters, social links)
    concierge.js            the ASK 果甘 conversation script
    dearGoodbye.js          every line of case-study copy, chapter spine
    media.js                media slots (showreel, workMedia, caseHero,
                            dearGoodbye) — empty means "use a placeholder"
  lib/conciergeBus.js       lets any CTA open the concierge
  lib/router.js             two paths, history, in-page anchors
public/media/               studio masters go here (see its README)
legacy/                     the previous BaZi site, kept for reference
netlify/functions/          existing functions, untouched
```

## Editing content

Copy, prices, work entries, services and the concierge script all live in
`src/content/`. Components read from those files, so text changes never
require touching layout code.

Adding a work entry: append an object to `works` in `src/content/site.js`.
When its case-study page exists, set `published: true` and the card turns
itself into a link to `/work/<slug>`. An optional `classification` array
replaces format + year on the card, and `cta` sets its link label.

Case-study copy is separate: `src/content/dearGoodbye.js` holds the film
details, the eleven-chapter spine, and the text of every chapter. Both the
case study and the teaser on the home page read that chapter list, so they
cannot drift apart.

Pricing is a rate sheet rather than a package grid. Each tier in `pricing`
carries `from`, `scope`, a `bestFor` list and an `includes` list, plus
`pricingDisclaimer` underneath. Published figures are starting points
only — final quotations are confirmed by the studio.

## Design system

| Token | Value |
| --- | --- |
| Cinema Black | `#0B0B0B` |
| Warm Ivory | `#F3EFE7` |
| Deep Burgundy | `#681E28` |
| Bronze Gold | `#B69A6A` |

Type: Cormorant Garamond (display), Noto Serif SC (Chinese and body),
Jost (uppercase labels, navigation, buttons). Sections alternate between
cinema black and warm ivory; bronze is reserved for hairlines, eyebrows
and single accents; burgundy carries the calls to action.

Layout is fluid rather than breakpoint-driven: `clamp()` type steps and a
`--gutter` that scales with the viewport. Where structure has to change it
does so once — the service ledger and the pricing sheet collapse to a
single column, the process rail goes 8 → 4 → 2 columns, the desktop
navigation becomes a full-screen drawer below 1024px, and the concierge
control steps aside while that drawer is open.

Motion is deliberately restrained — one staggered hero reveal, scroll
reveals of opacity and transform only, slow 620–1100 ms easings, and a
full `prefers-reduced-motion` bypass.

## Media placeholders

No third-party imagery ships with the site. Every image and video slot
renders a generated CSS placeholder until a studio-owned master is added
to `public/media/` and referenced in `src/content/media.js`.

`CinematicFrame` is the only component that renders film imagery. Give it
a `video` and it plays muted on hover with a play/pause control; give it
only a `src` and it renders the still; give it neither and it draws the
placeholder. Frames open up from 2.39 : 1 to 16 : 9 and then 3 : 2 as the
viewport narrows, so stills stay cinematic on a phone.

Work cards read their media from `workMedia[slug]`; the home-page teaser
reads `caseHero`, whose 16 : 9 slot is reserved for the final official
production still.

`FilmPlayer` is the case study's video container. Give it a `src` or an
`embed` and it shows a play control, mounting the video or the provider
iframe only once that is pressed; give it neither and it sits in standby,
saying the master is pending rather than standing anything else in. The
three official DEAR, GOODBYE masters — Episode 01 video, Episode 01
poster, branded spin-off video — have named, empty slots in
`media.js` under `dearGoodbye`; see `public/media/README.md`.

## The ASK 果甘 concierge

A studio-authored, deterministic flow behind the branded ✦ ASK 果甘
control: it explains the services, shows published starting prices, then
walks twelve questions — project type, purpose, platform, duration,
creative direction, characters, music, deadline, budget range, name,
email, WhatsApp — and assembles a grouped Project Brief the visitor can
email, send over WhatsApp, or copy.

The script and the component both enforce one commercial rule: the
concierge may explain published starting prices but never offers
discounts, negotiates, alters terms or confirms a final quotation. Pricing
pressure in a visitor's message trips `guardTerms` in
`src/content/concierge.js` and is answered with a fixed reply that refers
the quotation back to the studio.

## Routing

Two paths: `/` and `/work/dear-goodbye`. `src/lib/router.js` is forty
lines of `pushState` and `popstate` — no routing library — and Netlify's
SPA fallback already serves both paths on a hard load, so the router only
makes in-site navigation instant. `RouteLink` takes a path plus an
optional anchor (`to="/" hash="#work"`) and leaves modifier- and
middle-clicks to the browser.

## Deployment

`netlify.toml` is unchanged: `npm run build` → `dist`, functions in
`netlify/functions`, SPA fallback to `index.html`. Push a branch or open a
pull request for a Netlify Deploy Preview; production publishes from the
main branch.
