/* ══════════════════════════════════════════════════════════════
   果甘 AI 制片顾问 — conversation script (V02).

   Studio-authored and deterministic. The concierge explains how the
   studio works, may quote the PUBLISHED starting prices, and
   assembles a structured Project Brief.

   Commercial rule, enforced in the script and in the component:
   it never offers discounts, never negotiates, never alters terms
   and never confirms a final quotation. Custom quotations are
   confirmed by Guogan Banhu Studio.
   ══════════════════════════════════════════════════════════════ */

export const concierge = {
  title: "果甘 AI 制片顾问",
  subtitle: "Guogan Production Concierge",
  launcher: "Ask 果甘",
  greetingEn: ["Have an idea?", "Tell me what you're thinking."],
  greetingHan: ["我可以帮你了解制作方式、服务和价格，\n也可以帮你把想法整理成一份 Project Brief。"],
  prompt: "Where would you like to start?",
  quotaNote:
    "我只能说明公开的起始价格。最终报价、折扣与合约条款由果甘半壶工作室确认。\nPublished starting prices only — final quotations are confirmed by Guogan Banhu Studio.",
  guardReply: [
    "价格这部分我只能提供公开的起始价格，没有办法议价、给折扣或确认最终报价。",
    "我会把你的需求写进 Project Brief，制片人会直接与你确认正式报价与条款。",
  ],
};

export const topics = [
  {
    id: "short-drama",
    label: "Short Drama",
    han: "短剧",
    projectType: "Short Drama · 短剧",
    reply: [
      "AI 短剧是我们的主力项目。",
      "我们从故事大纲、人物设定、分镜开始，再进入 AI 影像制作、配音、配乐与后期。",
      "短剧的公开起始价格是 SGD 6,800，实际规模取决于集数、人物数量与时长。",
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    han: "商业广告",
    projectType: "Commercial · 商业广告",
    reply: [
      "品牌广告我们会先理解产品与受众，再写出一个能让人记住的故事。",
      "电影感品牌片的公开起始价格是 SGD 2,800，30–90 秒。",
      "产品、时尚、餐饮、生活风格与中小企业品牌我们都做过。",
    ],
  },
  {
    id: "music-video",
    label: "Music Video",
    han: "音乐影像",
    projectType: "Music Video · 音乐影像",
    reply: [
      "音乐影像我们会先听完整首歌，再决定影像语言。",
      "可以是纯视觉音乐，也可以是有角色、有剧情的 MV。",
      "如果需要原创音乐或 OST，我们也能一并制作。",
    ],
  },
  {
    id: "social-video",
    label: "Social Video",
    han: "社交短片",
    projectType: "Social Video · 社交短片",
    reply: [
      "社交短片的公开起始价格是 SGD 980，15–30 秒，适合 TikTok、Reels 与 Shorts。",
      "我们会按平台调整节奏与画幅，但故事感不会打折。",
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    han: "价格",
    reply: [
      "以下是我们公开的起始价格：",
      "Social — from SGD 980 · 15–30 秒\nCinematic — from SGD 2,800 · 30–90 秒\nShort Drama — from SGD 6,800 · 完整 AI 短剧\nBespoke — 系列 / 品牌活动 / IP 开发，另行报价",
      "价格会随范围、时长、复杂度、人物数量、修改次数、授权与交付要求而调整。",
    ],
  },
  {
    id: "idea",
    label: "I Have An Idea",
    han: "我有一个想法",
    reply: [
      "很好，故事通常就是从一句话开始的。",
      "先告诉我这个想法 — 哪怕只是一个画面、一个人物或一句对白。",
    ],
    asksIdea: true,
  },
];

/* The brief the concierge assembles. `options` are quick replies; every
   step also accepts free text. Steps flagged `optional` can be skipped. */
export const briefSteps = [
  {
    key: "projectType",
    label: "Project Type",
    question: "这是什么类型的项目？",
    hint: "Project type",
    options: ["Short Drama", "Commercial", "Music Video", "Social Video", "Brand Film", "Not sure yet"],
  },
  {
    key: "purpose",
    question: "这部片子要达成什么？",
    label: "Purpose",
    hint: "Purpose",
    options: [
      "Brand storytelling",
      "Product launch",
      "Original story / IP",
      "Corporate / Recruitment",
      "Investor or pitch film",
      "Still exploring",
    ],
  },
  {
    key: "platform",
    label: "Platform",
    question: "主要会在哪里播放？",
    hint: "Platform",
    options: ["TikTok", "Instagram Reels", "YouTube", "Website / Landing page", "Screening / Festival", "Multiple platforms"],
  },
  {
    key: "duration",
    label: "Duration",
    question: "预计的成品长度呢？",
    hint: "Duration",
    options: ["15–30 sec", "30–90 sec", "3–10 min", "Series / Multi-episode", "Not sure yet"],
  },
  {
    key: "direction",
    label: "Creative Direction",
    question: "有想过影像的调性吗？温暖、写实、诗意、冷峻…… 也可以给我参考片。",
    hint: "Creative direction, tone, references",
    placeholder: "例如：黄昏的老店，温暖但带一点遗憾…",
    optional: true,
  },
  {
    key: "characters",
    label: "Characters",
    question: "需要几个人物？",
    hint: "Characters",
    options: ["No characters", "1 character", "2–3 characters", "Ensemble cast", "Not sure yet"],
  },
  {
    key: "music",
    label: "Music Requirement",
    question: "音乐方面的需求是？",
    hint: "Music requirement",
    options: ["Original score / OST", "Licensed track", "Sound design only", "Studio to advise"],
  },
  {
    key: "deadline",
    label: "Deadline",
    question: "什么时候需要交片？",
    hint: "Deadline",
    options: ["Within 2 weeks", "Within 1 month", "1–3 months", "Flexible"],
  },
  {
    key: "budget",
    label: "Budget Range",
    question: "目前的预算范围大概在哪里？（参考我们公开的起始价格）",
    hint: "Indicative budget range",
    options: ["SGD 980 – 2,800", "SGD 2,800 – 6,800", "SGD 6,800 +", "Still deciding"],
  },
  {
    key: "name",
    label: "Name",
    question: "怎么称呼你？",
    hint: "Your name",
    placeholder: "例如：Tan Wei Ling",
  },
  {
    key: "email",
    label: "Email",
    question: "留一个 email，制片人会把回覆寄给你。",
    hint: "Email",
    placeholder: "name@company.com",
    validate: "email",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    question: "WhatsApp 号码？（可以跳过）",
    hint: "WhatsApp — optional",
    placeholder: "+65 …",
    optional: true,
  },
];

/* How the finished brief is grouped when it is rendered and exported. */
export const briefGroups = [
  { title: "The Idea", keys: ["idea"] },
  { title: "Project", keys: ["projectType", "purpose", "platform", "duration"] },
  { title: "Creative", keys: ["direction", "characters", "music"] },
  { title: "Schedule & Budget", keys: ["deadline", "budget"] },
  { title: "Contact", keys: ["name", "email", "whatsapp"] },
];

export const briefLabels = {
  idea: "The Idea",
  projectType: "Project Type",
  purpose: "Purpose",
  platform: "Platform",
  duration: "Duration",
  direction: "Creative Direction",
  characters: "Characters",
  music: "Music Requirement",
  deadline: "Deadline",
  budget: "Budget Range",
  name: "Name",
  email: "Email",
  whatsapp: "WhatsApp",
};

/* Free-text triggers that must never be negotiated with. */
export const guardTerms = [
  "discount",
  "cheaper",
  "cheapest",
  "negotiate",
  "negotiable",
  "best price",
  "lower price",
  "final price",
  "final quote",
  "free of charge",
  "折扣",
  "优惠",
  "便宜",
  "议价",
  "杀价",
  "最低",
  "最终报价",
  "免费做",
];
