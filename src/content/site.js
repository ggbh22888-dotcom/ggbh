/* ══════════════════════════════════════════════════════════════
   Single source of copy & data for the 果甘半壶 site.
   Edit text here — components read from this file.
   ══════════════════════════════════════════════════════════════ */

export const studio = {
  hanName: "果甘半壶",
  latinName: "GUOGAN BANHU",
  descriptor: "AI VIDEO STUDIO",
  location: "Singapore · Available Worldwide",
  manifestoHan: ["我们不生产 AI 视频。", "我们用 AI 拍故事。"],
  manifestoEn: ["We don't just make AI videos.", "We tell stories with AI."],
  email: "hello@guoganbanhu.com",
  whatsapp: "https://wa.me/6500000000",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  youtube: "https://youtube.com/",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/* Section 3 — Selected work.
   Every entry supports a poster/still, a video, title, format, year and a
   case-study link. `slug` is the case-study route (/work/<slug>); flip
   `published` to true once that page exists and the card becomes a link.
   Media lives in src/content/media.js, keyed by slug. */
export const works = [
  {
    slug: "dear-goodbye",
    han: "《亲爱的，再见》",
    latin: "Dear, Goodbye",
    kind: "AI Cinematic Short Drama",
    year: "2026",
    note: "A GUOGAN BANHU ORIGINAL PRODUCTION",
    featured: true,
    published: true,
    cta: "Explore the Project",
    /* Flagship classification, shown in place of format + year. */
    classification: ["Original AI Cinematic IP", "AI Cinematic Short Drama", "2026"],
    tone: "burgundy",
    frame: "2.39 : 1",
  },
  {
    slug: "first-meeting-ost",
    han: "初次见面",
    latin: "Original Soundtrack",
    kind: "Cinematic Music Visual",
    year: "2026",
    published: false,
    tone: "amber",
    frame: "2.00 : 1",
  },
  {
    slug: "bizsmile-547pm",
    han: "BizSmile",
    latin: "The 5:47 PM Case",
    kind: "Commercial / Branded Story",
    year: "2026",
    published: false,
    tone: "night",
    frame: "1.85 : 1",
  },
  {
    slug: "ah-hock",
    han: "Ah Hock",
    latin: "Cinematic SME Commercial",
    kind: "Cinematic SME Commercial",
    year: "2025",
    published: false,
    tone: "ivory",
    frame: "1.85 : 1",
  },
];

/* Section 4 — Services */
export const services = [
  {
    no: "01",
    title: "AI Short Drama",
    han: "AI 短剧",
    detail: "Short Drama / Series / Character-driven Story",
  },
  {
    no: "02",
    title: "Cinematic Film",
    han: "电影感影片",
    detail: "Brand Story / Short Film / Corporate Storytelling",
  },
  {
    no: "03",
    title: "Social Content",
    han: "社交内容",
    detail: "TikTok / Instagram Reels / YouTube Shorts",
  },
  {
    no: "04",
    title: "AI Commercial",
    han: "AI 商业广告",
    detail: "Product / Fashion / F&B / Lifestyle / SME",
  },
  {
    no: "05",
    title: "Music & MV",
    han: "音乐与音乐影像",
    detail: "Music Video / OST / Original Music / Visual Music",
  },
  {
    no: "06",
    title: "AI Character & Digital Actor",
    han: "AI 角色与数字演员",
    detail: "Character Design / Character Bible / Digital Actor",
  },
];

/* Section 5 — Production pipeline */
export const pipeline = [
  { step: "Idea", han: "想法" },
  { step: "Story", han: "故事" },
  { step: "Character", han: "角色" },
  { step: "Pre-Production", han: "前期制作" },
  { step: "AI Production", han: "AI 制作" },
  { step: "Sound", han: "声音" },
  { step: "Post-Production", han: "后期制作" },
  { step: "Delivery", han: "交付" },
];

/* Section 6 — Pricing preview.
   Published starting points only. Every entry carries `bestFor` and
   `includes` so the section reads as a studio rate sheet rather than a
   software pricing table. Final quotations are issued by the studio. */
export const pricing = [
  {
    no: "01",
    tier: "Social",
    han: "社交短片",
    from: "From SGD 980",
    scope: "15–30 sec social / product / concept video",
    bestFor: [
      "Product launches and teasers",
      "TikTok / Reels / Shorts campaigns",
      "Testing a concept before a larger film",
    ],
    includes: ["Creative Concept", "Script", "AI Video Production", "Editing", "Master Delivery"],
  },
  {
    no: "02",
    tier: "Cinematic",
    han: "电影感品牌片",
    from: "From SGD 2,800",
    scope: "30–90 sec cinematic brand film / commercial",
    bestFor: [
      "Brand films with a story, not a demo",
      "Founder and heritage storytelling",
      "Fashion, F&B, lifestyle and SME campaigns",
    ],
    includes: [
      "Creative Development",
      "Script",
      "Character Development",
      "Shot Design",
      "AI Image Production",
      "AI Video Production",
      "Voice Production",
      "Music / Sound",
      "Editing",
      "Master Delivery",
    ],
  },
  {
    no: "03",
    tier: "Short Drama",
    han: "AI 短剧",
    from: "From SGD 6,800",
    scope: "Full AI short drama production",
    accent: true,
    bestFor: [
      "Original story-led drama and pilots",
      "Character-driven IP you intend to grow",
      "Studios and brands producing episodic work",
    ],
    includes: [
      "Creative Development",
      "Screenplay",
      "Character Development",
      "Storyboard & Shot Design",
      "AI Image Production",
      "AI Video Production",
      "Voice Production",
      "Music / Sound",
      "Editing",
      "Master Delivery",
    ],
  },
  {
    no: "04",
    tier: "Bespoke",
    han: "定制项目",
    from: "Custom Quote",
    scope: "Series / Campaign / IP Development / Special Production",
    bestFor: [
      "Multi-episode series and seasons",
      "Campaigns across several markets or languages",
      "IP development and co-production",
    ],
    includes: ["Scoped and quoted with the studio, production by production"],
  },
];

export const pricingDisclaimer =
  "Final quotation depends on scope, duration, complexity, number of characters, revisions, licensing and delivery requirements. Every custom quotation is confirmed by Guogan Banhu Studio.";

/* Section 7 — the case-study teaser reads its chapter index straight
   from the case study itself (src/content/dearGoodbye.js), so the two
   can never drift apart. */

export const social = [
  { label: "Instagram", href: studio.instagram },
  { label: "TikTok", href: studio.tiktok },
  { label: "YouTube", href: studio.youtube },
  { label: "Email", href: `mailto:${studio.email}` },
  { label: "WhatsApp", href: studio.whatsapp },
];
