// netlify/functions/send-report.js
//
// 用 Resend（https://resend.com）寄出报告邮件，同时把这位客户的邮箱
// 加进 Resend 的联络人名单（Segment，原名 Audience）——这就是你要的「数据库」，
// 打开 Resend 后台就能看到所有留过邮箱的人，可以匯出成 CSV。
//
// 部署前必做（Netlify 后台 → Site configuration → Environment variables）：
//   RESEND_API_KEY       —— 在 resend.com 申请的 API 金钥
//   RESEND_AUDIENCE_ID   —— 在 Resend 后台建立一个 Audience/Segment 后拿到的 ID（选填，
//                            没设置的话邮件照样会寄，只是不会加进名单）
//   RESEND_FROM          —— 寄件人地址，例如 "GGHB <hello@yourdomain.com>"；
//                            还没有自己的域名之前，可以先用 "GGHB <onboarding@resend.dev>" 测试，
//                            但 onboarding@resend.dev 只能寄给你自己注册 Resend 时用的那个信箱，
//                            正式给客户寄信前，务必去 Resend 后台完成域名验证。
//
export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "服务器尚未设置 RESEND_API_KEY，请到 Netlify 后台的 Environment variables 加入。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "请求格式错误" }), { status: 400 });
  }

  const { email, name, tier, reading, chart, marketingConsent, language } = body;

  if (!email || !name || !reading) {
    return new Response(JSON.stringify({ error: "缺少必要资料（email / name / reading）" }), { status: 400 });
  }

  const fromAddress = process.env.RESEND_FROM || "GGHB <onboarding@resend.dev>";
  const en = language === "en";
  const tierLabel = en
    ? (tier === "full" ? "Complete BaZi report" : "BaZi reading (free preview)")
    : (tier === "full" ? "完整命盘报告" : "命盘初阅（免费预览）");

  // 把纯文字内容转成简单的 HTML 段落，并把【标题】转成小标题样式
  const bodyHtml = (reading || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^【(.+?)】\s*(.*)$/);
      if (m) {
        return `<h3 style="font-size:17px;color:#8A6844;margin:22px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">${m[1]}</h3>${
          m[2] ? `<p style="margin:0 0 12px;">${m[2]}</p>` : ""
        }`;
      }
      return `<p style="margin:0 0 12px;">${line}</p>`;
    })
    .join("\n");

  const pillarsHtml = chart
    ? `<p style="font-size:13px;color:#8C857A;">${en ? "Year" : "年柱"} ${chart.year}　${en ? "Month" : "月柱"} ${chart.month}　${en ? "Day" : "日柱"} ${chart.day}　${en ? "Hour" : "时柱"} ${chart.hour}</p>`
    : "";

  const html = `
    <div lang="${en ? "en" : "zh-Hans"}" style="font-family:Georgia,'Noto Serif SC',serif;max-width:600px;margin:0 auto;color:#2B2723;">
      <div style="text-align:center;padding:24px 0;">
        <div style="font-size:11px;letter-spacing:.3em;color:#8A6844;">果甘半壶　GGHB</div>
        <h1 style="font-size:22px;margin:10px 0 4px;">${en ? `${name}’s BaZi chart` : `${name} 的八字命盘`}</h1>
        <div style="font-size:13px;color:#8C857A;">${tierLabel}</div>
      </div>
      ${pillarsHtml}
      <div style="border:1px solid #eee;border-radius:8px;padding:24px;margin-top:16px;font-size:15px;line-height:1.9;">
        ${bodyHtml}
      </div>
      <p style="font-size:12px;color:#8C857A;text-align:center;margin-top:24px;">
        ${en ? "These readings explore tendencies, not fixed destiny. Take what resonates and let the rest go." : "命理为概率与倾向之学，非决定论；取其相应者，其余不妨轻轻放下。"}<br>
        果甘半壶 GGHB · GuoGanBanHu_8866
      </p>
    </div>`;

  try {
    // 1) 寄送报告邮件
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: en ? `${name}’s ${tierLabel} · GGHB` : `${name} 的${tierLabel} · 果甘半壶 GGHB`,
        html
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      return new Response(
        JSON.stringify({ error: `邮件寄送失败（${emailRes.status}）：${errText}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) 加进联络人名单（选填；没设置 RESEND_AUDIENCE_ID 就跳过，不影响邮件寄送结果）
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    let contactAdded = false;
    if (audienceId) {
      const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          first_name: name,
          unsubscribed: !marketingConsent // 没勾同意营销的，标记为 unsubscribed，Resend不会发广播信给他们
        })
      });
      contactAdded = contactRes.ok;
    }

    return new Response(JSON.stringify({ sent: true, contactAdded }), {
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
