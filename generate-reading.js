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

  const { name, gender, year, month, day, hour, dayStem, dayStemEl, strong, usefulEls, unhelpfulEls } = body;

  // 基本输入检查，避免明显异常的请求打到 API
  if (!name || !year || !month || !day || !hour || !dayStem) {
    return new Response(JSON.stringify({ error: "缺少必要的命盘资料" }), { status: 400 });
  }

  const prompt = `你是"果甘半壶 GGHB"命理工作室的命盘撰写者，用中文写一段简短的八字命盘初阅（约350-450字）。
文风参考：温和、具体、每个论断都要有命理依据支撑，不空泛。禁止使用"孤独终老"一类武断宿命论断，遇到空宫、忌神等情况要用中性、建设性的方式表达。结尾一句话总结，呼应开头的比喻。
客户资料：姓名${name}，${gender === "F" ? "女" : "男"}，四柱：年${year} 月${month} 日${day} 时${hour}，日主${dayStem}（${dayStemEl}）。
身强身弱：${strong ? "身强" : "身弱"}。用神：${(usefulEls || []).join("、")}。忌神：${(unhelpfulEls || []).join("、")}。
请直接输出正文，不要标题，不要任何前言或结语说明，也不要使用markdown符号。`;

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
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
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

    return new Response(JSON.stringify({ text }), {
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
