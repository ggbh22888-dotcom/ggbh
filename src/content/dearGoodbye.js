/* ══════════════════════════════════════════════════════════════
   《亲爱的，再见》DEAR, GOODBYE — flagship case study content.

   V03. Every line of copy on the case-study page lives here; the
   page components only lay it out. Media paths live separately in
   src/content/media.js (see `dearGoodbye`), so official masters can
   be connected later without touching this file or the layout.
   ══════════════════════════════════════════════════════════════ */

export const film = {
  han: "《亲爱的，再见》",
  latin: "Dear, Goodbye",
  positioning: "An Original AI Cinematic IP",
  classification: ["Original AI Cinematic IP", "AI Cinematic Short Drama", "2026"],
  taglineHan: "有些爱，不必团圆。",
  taglineEn: "Some love stories are not meant to end together.",
  meta: ["AI Cinematic Short Drama", "Original IP", "2026"],
  episodeLine: "EP01 · 2026 · AI Cinematic Drama",
  creditLabel: "Directed & Produced by",
  creditStudio: "Guogan Banhu AI Video Studio",
  keyArtCaption: "16 : 9 key art reserved for the official Episode 01 poster",
};

/* Chapter spine. `id` is the section anchor; the rail and the index
   both read this list, so a chapter is added in exactly one place. */
export const chapters = [
  { no: "I", id: "chapter-story", title: "The Story", han: "故事" },
  { no: "II", id: "chapter-character", title: "Character World", han: "人物世界" },
  { no: "III", id: "chapter-visual", title: "Visual Development", han: "视觉开发" },
  { no: "IV", id: "chapter-cinematography", title: "AI Cinematography", han: "AI 影像制作" },
  { no: "V", id: "chapter-watch", title: "Watch", han: "观看" },
  { no: "VI", id: "chapter-music", title: "Original Music", han: "原创音乐" },
  { no: "VII", id: "chapter-poster", title: "Poster & Key Art", han: "宣传视觉" },
  { no: "VIII", id: "chapter-collection", title: "IP & Merchandise", han: "IP 与周边" },
  { no: "IX", id: "chapter-brand", title: "Brand Integration", han: "品牌合作" },
  { no: "X", id: "chapter-bts", title: "Behind The Scenes", han: "幕后制作" },
  { no: "XI", id: "chapter-universe", title: "The IP Universe", han: "IP 宇宙" },
];

/* The arc this case study is here to demonstrate. */
export const ipArc = [
  "Idea",
  "Story",
  "Character",
  "Cinematography",
  "Film",
  "Music",
  "Visual Identity",
  "Brand Integration",
  "Merchandise",
  "IP",
];

/* ── I · The Story ────────────────────────────────────────── */
export const story = {
  han: [
    "他们不是不爱。\n只是两个人用了完全不同的方式去爱。",
    "林安然习惯独自面对人生。\n顾景川习惯把保护一个人，当成爱一个人的方式。",
    "当两个已经拥有自己人生的成年人再次走近，\n爱情不再只是关于相遇——\n而是关于信任、选择、距离，以及告别。",
  ],
  en: ["They never stopped caring.", "They simply learned to love in different ways."],
};

/* ── II · Character World ─────────────────────────────────── */
export const characterStatement = ["One character.", "One identity.", "Across every frame."];

export const characterNote =
  "角色一旦定下，就不再改变。同一张脸、同一套造型、同一种情绪逻辑，贯穿全剧每一个镜头。";

export const characters = [
  {
    slug: "lin-anran",
    latin: "Lin Anran",
    han: "林安然",
    tone: "night",
    lineHan: "习惯独自面对人生。",
    lineEn: "Used to facing life alone.",
  },
  {
    slug: "gu-jingchuan",
    latin: "Gu Jingchuan",
    han: "顾景川",
    tone: "burgundy",
    lineHan: "把保护一个人，当成爱一个人的方式。",
    lineEn: "Learned that protecting someone is how you love them.",
  },
];

/* What each character module is built to hold once the official
   portraits and frames are delivered. */
export const characterSlots = [
  { label: "Character Profile", han: "人物设定" },
  { label: "Costume", han: "造型" },
  { label: "Expression", han: "表情" },
  { label: "Emotional Arc", han: "情绪线" },
  { label: "Character Reference", han: "角色参考" },
  { label: "Final Film Frame", han: "正片画面" },
];

/* ── III · Visual Development ─────────────────────────────── */
export const visualDevelopment = [
  { key: "concept-art", label: "Concept Art", han: "概念设计", tone: "burgundy", ratio: "16 / 9" },
  { key: "character-design", label: "Character Design", han: "角色设计", tone: "night", ratio: "3 / 4" },
  { key: "location-design", label: "Location Design", han: "场景设计", tone: "amber", ratio: "16 / 9" },
  { key: "costume", label: "Costume", han: "服装造型", tone: "ivory", ratio: "3 / 4" },
  { key: "lighting", label: "Lighting", han: "灯光", tone: "night", ratio: "16 / 9" },
  { key: "key-frames", label: "Key Frames", han: "关键帧", tone: "burgundy", ratio: "2.39 / 1" },
  { key: "poster-development", label: "Poster Development", han: "海报开发", tone: "amber", ratio: "2 / 3" },
  { key: "storyboard", label: "Storyboard", han: "分镜", tone: "ivory", ratio: "4 / 3" },
];

/* ── IV · AI Cinematography ───────────────────────────────── */
export const cinematography = {
  statement: ["AI generates the image.", "Direction creates the performance."],
  pipeline: [
    { step: "Script", han: "剧本" },
    { step: "Shot Design", han: "分镜设计" },
    { step: "Key Frame", han: "关键帧" },
    { step: "Performance", han: "表演" },
    { step: "Motion", han: "动态" },
    { step: "Final Cut", han: "终剪" },
  ],
  directionLabel: "Direction Layer",
  direction: [
    { label: "Eyeline", han: "视线", note: "Where a character looks decides what the scene means." },
    { label: "Facial Performance", han: "面部表演", note: "Micro-expression held at the intensity the beat needs." },
    { label: "Reaction Chain", han: "反应链", note: "One character's beat lands on the other before the cut." },
    { label: "Continuity", han: "连戏", note: "Face, costume, light and lens stay consistent across shots." },
  ],
  note: "AI performance is directed, not prompted — through controlled eye-lines, micro-expressions, timed reactions and visual continuity. Our production recipes stay in the studio.",
  noteHan: "表演由导演控制，而不是交给随机生成。",
};

/* ── VI · Original Music ──────────────────────────────────── */
export const musicCategories = [
  { label: "Original Theme Song", han: "原创主题曲" },
  { label: "Original Soundtrack", han: "原声配乐" },
  { label: "Insert Song", han: "插曲" },
  { label: "Original Score", han: "原创配乐" },
];

export const soundtrack = [
  {
    key: "first-meeting",
    han: "初次见面",
    latin: "First Meeting",
    kind: "Original Soundtrack",
    style: "Slow Jazz · Saxophone",
    no: "01",
    actions: ["Play", "Watch MV", "Lyrics", "Credits"],
  },
];

export const musicNote =
  "原创音乐与影像同时开发：主题曲、插曲与配乐都为这个故事而写。";

/* ── VII · Poster & Key Art ───────────────────────────────── */
export const posterGallery = [
  { key: "series-main", label: "Series Main Poster", han: "主视觉海报", tone: "burgundy", ratio: "2 / 3" },
  { key: "episode", label: "Episode Poster", han: "分集海报", tone: "night", ratio: "2 / 3" },
  { key: "character", label: "Character Poster", han: "角色海报", tone: "ivory", ratio: "2 / 3" },
  { key: "soundtrack", label: "Soundtrack Poster", han: "原声海报", tone: "amber", ratio: "1 / 1" },
  { key: "mv", label: "MV Poster", han: "MV 海报", tone: "night", ratio: "1 / 1" },
  { key: "social", label: "Social Media Key Art", han: "社交主视觉", tone: "burgundy", ratio: "1 / 1" },
];

/* ── VIII · IP & Merchandise ──────────────────────────────── */
export const collection = {
  title: "Dear, Goodbye Collection",
  subtitle: "IP & Merchandise",
  status: "Coming Soon",
  note: "故事可以走出屏幕。周边不是纪念品，而是这个世界的延伸。",
  noteEn:
    "A story world can continue off screen. Nothing here is on sale yet — the collection is in development with the studio.",
  items: [
    { label: "Poster", han: "海报" },
    { label: "Postcard", han: "明信片" },
    { label: "Character Card", han: "角色卡" },
    { label: "Photo Book", han: "写真书" },
    { label: "Soundtrack Album", han: "原声专辑" },
    { label: "Apparel", han: "服饰" },
    { label: "Tote Bag", han: "帆布袋" },
    { label: "Collectibles", han: "收藏品" },
  ],
};

/* ── IX · Brand Integration ───────────────────────────────── */
export const brand = {
  headline: ["Stories people watch.", "Brands they remember."],
  han: ["让品牌进入故事，", "而不是打断故事。"],
  flow: { from: "From Story", to: "To Brand" },
  options: [
    {
      no: "01",
      label: "Product Placement",
      han: "产品植入",
      note: "The product belongs in the scene rather than sitting on top of it.",
    },
    {
      no: "02",
      label: "Story Integration",
      han: "故事融合",
      note: "Brand meaning written into the plot, carried by the characters.",
    },
    {
      no: "03",
      label: "Branded Episode",
      han: "品牌单集",
      note: "A full episode developed around a brand's own story.",
    },
    {
      no: "04",
      label: "Character Collaboration",
      han: "角色合作",
      note: "Established characters appearing inside a brand's world.",
    },
    {
      no: "05",
      label: "Commercial Spin-off",
      han: "商业衍生",
      note: "A commercial film that extends the drama instead of interrupting it.",
    },
  ],
  spinoff: {
    label: "Commercial Spin-off",
    han: "品牌衍生影片",
    caption: "16 : 9 container reserved for the official Dear, Goodbye branded film",
  },
};

/* ── X · Behind The Scenes ────────────────────────────────── */
export const behindTheScenes = [
  { no: "01", label: "Idea", han: "想法" },
  { no: "02", label: "Script", han: "剧本" },
  { no: "03", label: "Character", han: "角色" },
  { no: "04", label: "Storyboard", han: "分镜" },
  { no: "05", label: "Image", han: "画面" },
  { no: "06", label: "Performance", han: "表演" },
  { no: "07", label: "Video", han: "影像" },
  { no: "08", label: "Voice", han: "配音" },
  { no: "09", label: "Music", han: "音乐" },
  { no: "10", label: "Edit", han: "剪辑" },
];

export const behindTheScenesNote =
  "十个阶段，全部在工作室内部完成。我们公开流程，不公开提示词。";

/* ── XI · The IP Universe ─────────────────────────────────── */
export const universe = {
  statement: ["A story does not have to end", "when the film ends."],
  centre: { latin: "Dear, Goodbye", han: "《亲爱的，再见》" },
  nodes: [
    { label: "Short Drama", han: "短剧", state: "In production" },
    { label: "Original Music", han: "原创音乐", state: "In production" },
    { label: "Music Video", han: "音乐影像", state: "In development" },
    { label: "Posters", han: "宣传视觉", state: "In development" },
    { label: "Character IP", han: "角色 IP", state: "In development" },
    { label: "Branded Content", han: "品牌内容", state: "Open to partners" },
    { label: "Merchandise", han: "周边", state: "Coming soon" },
    { label: "Future Episodes", han: "后续剧集", state: "Planned" },
  ],
};

/* ── Closing ──────────────────────────────────────────────── */
export const closing = {
  headline: ["Have a story?", "Let's build its world."],
  han: ["一个想法、一个人物，", "甚至一句还没有说完的话，", "都可以成为故事的开始。"],
  cta: "Start a Project",
};
