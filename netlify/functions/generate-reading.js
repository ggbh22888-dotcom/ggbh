// netlify/functions/generate-reading.js
//
// 这支函数在 Netlify 的服务器端运行，不会被浏览器看到源码，
// 所以可以安全地使用 API 金钥（存在 Netlify 后台的环境变量里）。
//
// 部署前必做：Netlify 后台 → Site configuration → Environment variables
//            新增一个变量：ANTHROPIC_API_KEY = 你自己在 console.anthropic.com 申请的金钥
//
export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "服务器尚未设置 ANTHROPIC_API_KEY，请到 Netlify 后台的 Environment variables 加入。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "请求格式错误" }), { status: 400 });
  }

  const { name, gender, tier, language, year, month, day, hour, dayStem, dayStemEl, strong, usefulEls, unhelpfulEls } = body;

  // 基本输入检查，避免明显异常的请求打到 API
  if (!name || !year || !month || !day || !hour || !dayStem) {
    return new Response(JSON.stringify({ error: "缺少必要的命盘资料" }), { status: 400 });
  }

  const isFull = tier === "full";
  const genderLabel = gender === "F" ? "女" : "男";
  const baseFacts = `客户资料：姓名${name}，${genderLabel}，四柱：年${year} 月${month} 日${day} 时${hour}，日主${dayStem}（${dayStemEl}）。
身强身弱：${strong ? "身强" : "身弱"}。用神：${(usefulEls || []).join("、")}。忌神：${(unhelpfulEls || []).join("、")}。`;

  const styleRules = `文风要求：温和、具体，每一个论断都要有命理依据支撑（说明是根据哪个天干地支或十神关系推出的），不空泛、不套话。
严格禁止使用"孤独终老"一类武断宿命论断；遇到忌神、身弱等不利结构时，用中性、建设性的方式表达（说明可以如何应对，而不是宣判凶险）。
不使用markdown符号（不要井号、星号），用纯文字与自然分段。`;

  const prompt = isFull
    ? `你是"果甘半壶 GGHB"命理工作室的命盘撰写者，用中文为客户撰写一份完整的八字命盘报告（总长约1800-2400字）。

${baseFacts}

${styleRules}

请按以下结构撰写，每个段落前用【标题】标示（不要用markdown的#号），段落之间空一行：

【命局总论】总述日主特质、身强身弱、用神忌神，约200字，为全篇定调。
【性情与心性】从日主五行与十神关系分析性格长处与可开拓之处，约250字。
【事业与方向】依用神五行推荐适合的行业方向与工作型态，约250字。
【财运与资产】依财星（我克者）分析财运特质与理财建议，约250字。
【感情婚姻】依日主与十神关系分析感情特质与相处建议（若为女命看正官七杀，男命看正财偏财），约250字。
【健康与身心】依五行对应脏腑，指出需留意的身体系统与养生方向，约200字。
【总结与建议】三点具体可行的建议，收在一句话总结，约200字。

请直接输出正文内容，不要在最前面加任何前言或说明。`
    : `你是"果甘半壶 GGHB"命理工作室的命盘撰写者，用中文写一段简短的八字命盘初阅（约350-450字），作为免费预览版，让读者对完整版产生兴趣但不要写完整分析。

${baseFacts}

${styleRules}

请直接输出正文，不要标题，不要任何前言或结语说明。`;

  const outputLanguage = language === "en"
    ? "Write the entire report in English, including section headings. Translate the section headings above into English but keep the 【Heading】 format. Keep the original Chinese Heavenly Stem and Earthly Branch characters when identifying pillars, explaining their meaning in English. For the preview write about 250–350 English words; for the full report write about 1,500–1,800 English words."
    : "请用简体中文撰写全文。";

  const maxTokens = isFull ? 4096 : 1000;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: `${prompt}\n\nOutput language requirement (takes precedence over language and length instructions above): ${outputLanguage}` }]
      })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(
        JSON.stringify({ error: `Claude API 呼叫失败（${anthropicRes.status}）：${errText}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return new Response(JSON.stringify({ text, tier: isFull ? "full" : "preview" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: `服务器错误：${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
