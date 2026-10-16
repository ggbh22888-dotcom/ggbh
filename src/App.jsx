import { useState, useEffect } from "react";
import { LanguageProvider, useLanguage, translate } from "./language.jsx";
import { Sparkles, Compass, CalendarDays, ScrollText, Check, ChevronRight, Loader2 } from "lucide-react";

/* ═══════════════════════════ 设计代币（沿用 GGHB 既有品牌）═══════════════════════════ */
const T = {
  paper: "#F7F3EA", panel: "rgba(255,255,255,.6)", ink: "#2B2723", ink2: "#4A443D", muted: "#8C857A",
  tea: "#8A6844", gold: "#B8964F", dai: "#4A5D5E", cinnabar: "#A94438",
  wood: "#5A7247", fire: "#A94438", earth: "#8A6844", metal: "#B8964F", water: "#4A5D5E",
  line: "rgba(138,104,68,.22)",
  serif: '"Kaiti SC","STKaiti","Noto Serif SC","Songti SC",serif',
  bodySerif: '"Noto Serif SC","Songti SC",Georgia,serif',
  ui: '-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif'
};

/* ═══════════════════════════ 八字排盘核心逻辑（已验证公式） ═══════════════════════════ */
const STEMS = "甲乙丙丁戊己庚辛壬癸";
const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
const STEM_EL = { 甲:"wood",乙:"wood",丙:"fire",丁:"fire",戊:"earth",己:"earth",庚:"metal",辛:"metal",壬:"water",癸:"water" };
const BRANCH_EL = { 子:"water",丑:"earth",寅:"wood",卯:"wood",辰:"earth",巳:"fire",午:"fire",未:"earth",申:"metal",酉:"metal",戌:"earth",亥:"water" };
const EL_CN = { wood:"木", fire:"火", earth:"土", metal:"金", water:"水" };

const JIE_ORDER = [
  {m:1,d:6,branch:"丑"},{m:2,d:4,branch:"寅"},{m:3,d:6,branch:"卯"},{m:4,d:5,branch:"辰"},
  {m:5,d:6,branch:"巳"},{m:6,d:6,branch:"午"},{m:7,d:7,branch:"未"},{m:8,d:8,branch:"申"},
  {m:9,d:8,branch:"酉"},{m:10,d:8,branch:"戌"},{m:11,d:7,branch:"亥"},{m:12,d:7,branch:"子"}
];
const MONTH_START_STEM = { 甲:"丙",己:"丙", 乙:"戊",庚:"戊", 丙:"庚",辛:"庚", 丁:"壬",壬:"壬", 戊:"甲",癸:"甲" };
const HOUR_START_STEM  = { 甲:"甲",己:"甲", 乙:"丙",庚:"丙", 丙:"戊",辛:"戊", 丁:"庚",壬:"庚", 戊:"壬",癸:"壬" };
const MONTH_ORDER = "寅卯辰巳午未申酉戌亥子丑";

function dayPillar(y,m,d){
  const base = Date.UTC(1900,0,1);
  const days = Math.round((Date.UTC(y,m-1,d)-base)/86400000);
  const idx = ((10+days)%60+60)%60;
  return STEMS[idx%10]+BRANCHES[idx%12];
}
function yearPillar(y,m,d){
  let by = y;
  if(m<2 || (m===2 && d<4)) by -= 1;
  const s=((by-4)%10+10)%10, b=((by-4)%12+12)%12;
  return STEMS[s]+BRANCHES[b];
}
function monthBranchOf(m,d){
  let result = "子";
  for(const cur of JIE_ORDER){ if(m>cur.m || (m===cur.m && d>=cur.d)) result = cur.branch; }
  if(m===1 && d < JIE_ORDER[0].d) result = "子";
  return result;
}
function monthPillar(yearStem, m, d){
  const branch = monthBranchOf(m,d);
  const startStem = MONTH_START_STEM[yearStem];
  const startIdx = STEMS.indexOf(startStem);
  const offset = MONTH_ORDER.indexOf(branch);
  return STEMS[(startIdx+offset)%10] + branch;
}
function hourPillar(dayStem, hour){
  const branchIdx = Math.floor((((hour+1)%24)+24)%24/2);
  const startStem = HOUR_START_STEM[dayStem];
  const startIdx = STEMS.indexOf(startStem);
  return STEMS[(startIdx+branchIdx)%10] + BRANCHES[branchIdx];
}
function fullChart(y,m,d,hour){
  const yp = yearPillar(y,m,d);
  const dp = dayPillar(y,m,d);
  const mp = monthPillar(yp[0], m, d);
  const hp = hourPillar(dp[0], hour);
  return { year:yp, month:mp, day:dp, hour:hp, dayStem:dp[0] };
}

// 十神/五行权重（沿用报告体系一贯使用的位置加权：年干5 年支20 月干5 月支35 日支20 时干5 时支10）
const KE = { wood:"earth", earth:"water", water:"fire", fire:"metal", metal:"wood" };
const KE_ME = { wood:"metal", metal:"fire", fire:"water", water:"earth", earth:"wood" };
const SHENG_ME = { wood:"water", water:"metal", metal:"earth", earth:"fire", fire:"wood" };

function analyzeChart(chart){
  const me = STEM_EL[chart.dayStem];
  const weights = [
    { el: STEM_EL[chart.year[0]], w:5 }, { el: BRANCH_EL[chart.year[1]], w:20 },
    { el: STEM_EL[chart.month[0]], w:5 }, { el: BRANCH_EL[chart.month[1]], w:35 },
    { el: BRANCH_EL[chart.day[1]], w:20 },
    { el: STEM_EL[chart.hour[0]], w:5 }, { el: BRANCH_EL[chart.hour[1]], w:10 }
  ];
  const totals = { wood:0, fire:0, earth:0, metal:0, water:0 };
  weights.forEach(({el,w})=>{ totals[el]+=w; });

  const resourceEl = SHENG_ME[me];                                          // 生我者／印，直接查表
  const outputEl   = Object.keys(SHENG_ME).find(k=>SHENG_ME[k]===me);       // 我生者／食伤，需反查
  const officerEl  = KE_ME[me];                                             // 克我者／官杀，直接查表
  const wealthEl   = KE[me];                                                // 我克者／财，直接查表

  const add = totals[me] + totals[resourceEl];
  const strong = add >= 45;
  const usefulEls = strong ? [officerEl, wealthEl, outputEl] : [me, resourceEl];
  const unhelpfulEls = Object.keys(totals).filter(e=>!usefulEls.includes(e));
  return { me, totals, add, strong, usefulEls:[...new Set(usefulEls)], unhelpfulEls };
}

/* ═══════════════════════════ AI 报告生成（呼叫自家 Netlify Function，金钥留在服务器端） ═══════════════════════════ */
async function generateReading({ name, gender, chart, analysis, language, tier="preview" }){
  const t = (zh) => translate(language, zh);
  const res = await fetch("/.netlify/functions/generate-reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name, gender, tier, language,
      year: chart.year, month: chart.month, day: chart.day, hour: chart.hour,
      dayStem: chart.dayStem, dayStemEl: EL_CN[STEM_EL[chart.dayStem]],
      strong: analysis.strong,
      usefulEls: analysis.usefulEls.map(e=>EL_CN[e]),
      unhelpfulEls: analysis.unhelpfulEls.map(e=>EL_CN[e])
    })
  });
  if(!res.ok){
    throw new Error(language === "en" ? `Report service is temporarily unavailable (${res.status}). Please try again later.` : `报告生成服务暂时无法使用（${res.status}），请稍后重试。`);
  }
  const data = await res.json();
  return data.text || t("（报告生成中遇到问题，请稍后重试。）");
}

/* ═══════════════════════════ 共用组件 ═══════════════════════════ */
function Sigil({ size=64, char="命" }){
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", border:`1.5px solid ${T.gold}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:T.serif, fontSize:size*0.5, color:T.tea,
      background:`radial-gradient(circle, rgba(184,150,79,.12), transparent 70%)`
    }}>{char}</div>
  );
}

function PillarTile({ label, gz, delay }){
  const [show, setShow] = useState(false);
  useEffect(()=>{ const t=setTimeout(()=>setShow(true), delay); return ()=>clearTimeout(t); },[delay]);
  const stemEl = STEM_EL[gz[0]], branchEl = BRANCH_EL[gz[1]];
  const stemColor = T[stemEl], branchColor = T[branchEl];
  return (
    <div style={{
      opacity: show?1:0, transform: show? "translateY(0)":"translateY(14px)",
      transition:"all .55s cubic-bezier(.2,.7,.3,1)",
      background:T.panel, border:`1px solid ${T.line}`, borderRadius:8,
      padding:"14px 10px", textAlign:"center", minWidth:74
    }}>
      <div style={{fontSize:11, letterSpacing:".2em", color:T.muted, fontFamily:T.ui, marginBottom:8}}>{label}</div>
      <div style={{fontFamily:T.serif, fontSize:30, lineHeight:1.1}}>
        <span style={{color:stemColor}}>{gz[0]}</span>
        <span style={{color:branchColor}}>{gz[1]}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════ 首页 ═══════════════════════════ */
function Home({ onStart }){
  const { t } = useLanguage();
  const services = [
    { icon: ScrollText, name:t("八字紫微全盘详批"), desc:t("四柱八字与紫微斗数合参，十六章完整解读") },
    { icon: CalendarDays, name:t("择日日历"), desc:t("依用神择日，未来十二个月流日吉凶速查") },
    { icon: Compass, name:t("风水方位报告"), desc:t("命卦八宅与日主用神合参，居家方位布局建议") },
  ];
  const plans = [
    { name:t("免费试算"), price:"S$0", features:[t("四柱排盘"),t("五行分布图"),t("约400字命盘初阅")], cta:t("立即试算"), highlight:false },
    { name:t("完整命盘报告"), price:"S$68", sub:t("单次付费，无需订阅"), features:[t("十六项主题完整解读"),t("五行雷达图"),t("大运流年分析"),t("事业财运感情健康总览"),t("即时生成，无需等待")], cta:t("选择此方案"), highlight:true },
  ];
  return (
    <div>
      {/* Hero */}
      <div style={{padding:"88px 24px 64px", textAlign:"center", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", inset:0, background:`radial-gradient(circle at 20% 10%, rgba(255,255,255,.7), transparent 55%), radial-gradient(circle at 85% 85%, rgba(184,150,79,.08), transparent 55%)`}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:11, letterSpacing:".5em", color:T.tea, marginBottom:28, fontFamily:T.ui}}>果甘半壶　GGHB</div>
          <div style={{display:"flex", justifyContent:"center", marginBottom:26}}><Sigil size={86}/></div>
          <h1 style={{fontFamily:T.serif, fontSize:"clamp(30px,5vw,46px)", fontWeight:600, letterSpacing:".08em", margin:"0 0 14px", color:T.ink}}>
            {t("把你的四柱，摊在阳光下")}
          </h1>
          <p style={{fontFamily:T.bodySerif, fontSize:17, color:T.ink2, maxWidth:520, margin:"0 auto 36px", lineHeight:1.9}}>
            {t("填入出生资料，即时排出八字命盘，AI 依你的五行喜忌撰写命盘初阅。")}<br/>
            {t("往下，是完整命盘、择日日历与风水方位的专业报告。")}
          </p>
          <button onClick={onStart} style={{
            background:T.tea, color:"#fff", border:"none", borderRadius:6, padding:"15px 38px",
            fontSize:16, fontFamily:T.ui, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8,
            boxShadow:"0 8px 24px rgba(138,104,68,.25)"
          }}>
            <Sparkles size={17}/> {t("免费开始测算")}
          </button>
        </div>
      </div>

      {/* Services */}
      <div style={{maxWidth:960, margin:"0 auto", padding:"20px 24px 64px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:18}}>
          {services.map((s,i)=>(
            <div key={i} style={{background:T.panel, border:`1px solid ${T.line}`, borderRadius:10, padding:"26px 22px"}}>
              <s.icon size={22} color={T.tea} strokeWidth={1.6}/>
              <div style={{fontFamily:T.serif, fontSize:18, margin:"14px 0 6px", color:T.ink}}>{s.name}</div>
              <div style={{fontSize:14, color:T.muted, lineHeight:1.7}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{background:"rgba(138,104,68,.05)", padding:"64px 24px", borderTop:`1px solid ${T.line}`}}>
        <div style={{maxWidth:980, margin:"0 auto"}}>
          <h2 style={{fontFamily:T.serif, fontSize:26, textAlign:"center", marginBottom:8, color:T.ink}}>{t("方案与定价")}</h2>
          <p style={{textAlign:"center", color:T.muted, fontSize:14, marginBottom:40}}>{t("命理为概率与倾向之学，非决定论；取其相应者，其余不妨轻轻放下。")}</p>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:20}}>
            {plans.map((p,i)=>(
              <div key={i} style={{
                background:p.highlight? "#fff":T.panel, borderRadius:10, padding:"28px 24px",
                border: p.highlight? `1.5px solid ${T.gold}`:`1px solid ${T.line}`,
                boxShadow: p.highlight? "0 10px 30px rgba(184,150,79,.18)":"none", position:"relative"
              }}>
                {p.highlight && <div style={{position:"absolute", top:-11, left:24, background:T.gold, color:"#fff", fontSize:11, padding:"3px 10px", borderRadius:4, fontFamily:T.ui}}>{t("最多人选择")}</div>}
                <div style={{fontFamily:T.serif, fontSize:18, marginBottom:6}}>{p.name}</div>
                <div style={{display:"flex", alignItems:"baseline", gap:4, marginBottom:18}}>
                  <span style={{fontFamily:T.serif, fontSize:32, color:T.tea}}>{p.price}</span>
                  {p.sub && <span style={{fontSize:13, color:T.muted}}>{p.sub}</span>}
                </div>
                <ul style={{listStyle:"none", padding:0, margin:"0 0 22px"}}>
                  {p.features.map((f,j)=>(
                    <li key={j} style={{display:"flex", gap:8, fontSize:13.5, color:T.ink2, marginBottom:9}}>
                      <Check size={15} color={T.wood} style={{flexShrink:0, marginTop:2}}/>{f}
                    </li>
                  ))}
                </ul>
                <button style={{
                  width:"100%", padding:"11px", borderRadius:6, border: p.highlight?"none":`1px solid ${T.tea}`,
                  background: p.highlight? T.tea : "transparent", color: p.highlight? "#fff":T.tea,
                  fontSize:14, fontFamily:T.ui, cursor:"pointer"
                }}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{textAlign:"center", padding:"28px", fontSize:12, color:T.muted, fontFamily:T.ui}}>
        果甘半壶 GGHB · GuoGanBanHu_8866
      </div>
    </div>
  );
}

/* ═══════════════════════════ 填资料表单 ═══════════════════════════ */
function Intake({ onSubmit, onBack }){
  const { t, language } = useLanguage();
  const [form, setForm] = useState({ name:"", email:"", gender:"F", date:"", time:"12:00", marketingConsent:false });
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canSubmit = form.name && form.date && emailOk;
  return (
    <div style={{maxWidth:460, margin:"0 auto", padding:"70px 24px"}}>
      <button onClick={onBack} style={{background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", marginBottom:26, fontFamily:T.ui}}>{t("← 返回")}</button>
      <div style={{textAlign:"center", marginBottom:34}}>
        <Sigil size={56}/>
        <h2 style={{fontFamily:T.serif, fontSize:24, margin:"18px 0 8px"}}>{t("请填入出生资料")}</h2>
        <p style={{fontSize:13.5, color:T.muted}}>{t("时间精确到出生钟表时间即可，系统会自动排出四柱")}</p>
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:16}}>
        <input aria-label={t("姓名")} placeholder={t("姓名")} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
          style={inputStyle}/>
        <div>
          <input aria-label={t("电邮地址")} placeholder={t("电邮地址")} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            style={inputStyle}/>
          <div style={{fontSize:11.5, color:T.muted, marginTop:5, fontFamily:T.ui}}>{t("报告会寄一份到这个信箱，方便你之后随时查阅")}</div>
        </div>
        <div style={{display:"flex", gap:10}}>
          <button onClick={()=>setForm({...form,gender:"F"})} style={genderBtn(form.gender==="F")}>{t("女")}</button>
          <button onClick={()=>setForm({...form,gender:"M"})} style={genderBtn(form.gender==="M")}>{t("男")}</button>
        </div>
        <label style={labelStyle}>{t("出生日期")}
          <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inputStyle}/>
        </label>
        <label style={labelStyle}>{t("出生时间")}
          <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={inputStyle}/>
        </label>
        <div style={{fontSize:12, color:T.muted, background:"rgba(169,68,56,.05)", padding:"10px 14px", borderRadius:6, lineHeight:1.7}}>
          {t("⚠️ 若出生日期落在节气交界前后1-2天，月柱可能需要人工复核，建议届时联系顾问确认。")}
        </div>
        <label style={{display:"flex", alignItems:"flex-start", gap:9, fontSize:12.5, color:T.ink2, fontFamily:T.ui, lineHeight:1.6, cursor:"pointer"}}>
          <input type="checkbox" checked={form.marketingConsent} onChange={e=>setForm({...form,marketingConsent:e.target.checked})}
            style={{marginTop:2, flexShrink:0}}/>
          {t("我愿意收到果甘半壶 GGHB 不定期的命理资讯与优惠通知（选填，不勾选不影响报告寄送）")}
        </label>
        <button disabled={!canSubmit} onClick={()=>onSubmit({...form, language})} style={{
          ...primaryBtn, opacity: canSubmit?1:.4, cursor: canSubmit?"pointer":"not-allowed"
        }}>{t("开始排盘")} <ChevronRight size={16}/></button>
      </div>
    </div>
  );
}
const inputStyle = { padding:"12px 14px", borderRadius:6, border:`1px solid ${T.line}`, fontSize:15, fontFamily:T.bodySerif, background:"#fff", width:"100%", boxSizing:"border-box" };
const labelStyle = { fontSize:12.5, color:T.muted, fontFamily:T.ui, display:"flex", flexDirection:"column", gap:6 };
const primaryBtn = { background:T.tea, color:"#fff", border:"none", borderRadius:6, padding:"14px", fontSize:15, fontFamily:T.ui, display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:8 };
const genderBtn = (active)=>({
  flex:1, padding:"11px", borderRadius:6, border:`1px solid ${active?T.tea:T.line}`,
  background: active? "rgba(138,104,68,.1)":"#fff", color: active?T.tea:T.ink2, fontFamily:T.ui, cursor:"pointer"
});

/* ═══════════════════════════ 排盘中 + 报告预览 ═══════════════════════════ */
// ⚠️ 部署前，把这里换成你自己在 Stripe 后台建立的付款连结（Payment Link）
// Stripe 后台：Payment Link 设定 → After payment → Redirect customers to your website
// 网址填：https://你的网址/?paid=true  （务必保留 ?paid=true 这段，付款完成会靠这个自动解锁完整版）
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/替换成你自己的付款连结";

function Report({ form, onBack, initialTier="preview" }){
  const { t, language } = useLanguage();
  const [phase, setPhase] = useState("calc"); // calc -> pillars -> ai -> done
  const [chart, setChart] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [reading, setReading] = useState("");
  const [err, setErr] = useState(null);
  const [tier] = useState(initialTier); // "preview" | "full"
  const [emailStatus, setEmailStatus] = useState("idle"); // idle -> sending -> sent -> failed

  useEffect(()=>{
    sessionStorage.setItem("gghb_form", JSON.stringify(form));
    const [y,m,d] = form.date.split("-").map(Number);
    const [hh] = form.time.split(":").map(Number);
    const c = fullChart(y,m,d,hh);
    const a = analyzeChart(c);
    setChart(c); setAnalysis(a);
    const t = setTimeout(()=>setPhase("pillars"), 300);
    return ()=>clearTimeout(t);
  },[form]);

  useEffect(()=>{
    if(phase!=="pillars") return;
    const t = setTimeout(async ()=>{
      setPhase("ai");
      let text = "";
      try{
        text = await generateReading({ name:form.name, gender:form.gender, chart, analysis, tier, language: form.language || "zh" });
        setReading(text);
      }catch(e){ setErr(e.message || t("报告生成遇到问题，请稍后重试。")); }
      setPhase("done");
      if(text && form.email){
        setEmailStatus("sending");
        try{
          const res = await fetch("/.netlify/functions/send-report", {
            method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ email:form.email, name:form.name, tier, reading:text, chart, language: form.language || "zh", marketingConsent: !!form.marketingConsent })
          });
          setEmailStatus(res.ok ? "sent" : "failed");
        }catch{ setEmailStatus("failed"); }
      }
    }, tier==="full" ? 1200 : 2400);
    return ()=>clearTimeout(t);
  },[phase]);

  function goPay(){
    sessionStorage.setItem("gghb_form", JSON.stringify(form));
    window.location.href = STRIPE_PAYMENT_LINK;
  }

  if(!chart) return null;

  return (
    <div id="report-print-root" style={{maxWidth:640, margin:"0 auto", padding:"60px 24px 90px"}}>
      <button onClick={onBack} className="no-print" style={{background:"none", border:"none", color:T.muted, fontSize:13, cursor:"pointer", marginBottom:22, fontFamily:T.ui}}>{t("← 重新填写")}</button>

      <div style={{textAlign:"center", marginBottom:30}}>
        <div style={{fontSize:11, letterSpacing:".3em", color:T.tea, fontFamily:T.ui}}>果甘半壶　GGHB</div>
        <h2 style={{fontFamily:T.serif, fontSize:24, margin:"10px 0 4px"}}>{language === "en" ? `${form.name}’s BaZi chart` : `${form.name} 的八字命盘`}</h2>
        <div style={{fontSize:13, color:T.muted}}>{form.gender==="F"?t("女"):t("男")} · {form.date} · {form.time}</div>
        {tier==="full" && (
          <div style={{display:"inline-flex", alignItems:"center", gap:5, marginTop:10, background:"rgba(90,114,71,.12)", color:T.wood, fontSize:12, fontFamily:T.ui, padding:"4px 12px", borderRadius:20}}>
            <Check size={13}/> {t("已解锁完整命盘报告")}
          </div>
        )}
      </div>

      <div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:34}}>
        <PillarTile label={t("年柱")} gz={chart.year} delay={0}/>
        <PillarTile label={t("月柱")} gz={chart.month} delay={200}/>
        <PillarTile label={t("日柱")} gz={chart.day} delay={400}/>
        <PillarTile label={t("时柱")} gz={chart.hour} delay={600}/>
      </div>

      {phase!=="done" && (
        <div className="no-print" style={{textAlign:"center", padding:"30px 0", color:T.muted, fontSize:14, fontFamily:T.ui, display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
          <Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>
          {phase==="calc" && t("正在排盘…")}
          {(phase==="pillars"||phase==="ai") && (tier==="full" ? t("四柱已排出，AI 正在撰写完整命盘报告…") : t("四柱已排出，AI 正在撰写命盘初阅…"))}
        </div>
      )}

      {phase==="done" && analysis && (
        <>
          <div style={{background:T.panel, border:`1px solid ${T.line}`, borderRadius:8, padding:"18px 20px", marginBottom:22, fontSize:13.5, fontFamily:T.ui}}>
            <div style={{marginBottom:6}}>{t("日主：")}<b>{chart.dayStem}（{t(EL_CN[STEM_EL[chart.dayStem]])}）</b>　{t("格局：")}<b>{analysis.strong?t("身强"):t("身弱")}</b></div>
            <div>{t("用神：")}<b style={{color:T.wood}}>{analysis.usefulEls.map(e=>t(EL_CN[e])).join(language === "en" ? ", " : "、")}</b>　{t("忌神：")}<span style={{color:T.muted}}>{analysis.unhelpfulEls.map(e=>t(EL_CN[e])).join(language === "en" ? ", " : "、")}</span></div>
          </div>

          <div className="no-print" style={{display:"flex", gap:8, justifyContent:"flex-end", marginBottom:10, fontSize:12.5, fontFamily:T.ui, color:T.muted, alignItems:"center"}}>
            {emailStatus==="sending" && <><Loader2 size={12} style={{animation:"spin 1s linear infinite"}}/> {t("正在寄送到")} {form.email}…</>}
            {emailStatus==="sent" && <><Check size={13} color={T.wood}/> {t("已寄送到")} {form.email}</>}
            {emailStatus==="failed" && <span style={{color:T.cinnabar}}>{t("邮件寄送失败，可用下方按钮下载存档")}</span>}
          </div>

          <div style={{background:"#fff", border:`1px solid ${T.line}`, borderRadius:10, padding:"28px 26px", fontFamily:T.bodySerif, fontSize:15.5, lineHeight:2, color:T.ink}}>
            {err ? <span style={{color:T.cinnabar}}>{err}</span> : reading.split("\n").filter(Boolean).map((p,i)=>{
              const headingMatch = p.match(/^【(.+?)】\s*(.*)$/);
              if(headingMatch){
                return (
                  <div key={i} style={{marginTop: i===0?0:22}}>
                    <div style={{fontFamily:T.serif, fontSize:18, color:T.tea, marginBottom:8, borderBottom:`1px solid ${T.line}`, paddingBottom:6}}>
                      {headingMatch[1]}
                    </div>
                    {headingMatch[2] && <p style={{margin:0}}>{headingMatch[2]}</p>}
                  </div>
                );
              }
              return <p key={i} style={{margin:"0 0 14px"}}>{p}</p>;
            })}
          </div>

          <div className="no-print" style={{textAlign:"center", marginTop:16}}>
            <button onClick={()=>window.print()} style={{...primaryBtn2, background:"#fff", color:T.tea, border:`1px solid ${T.tea}`}}>{t("下载 / 打印 PDF")}</button>
          </div>

          {tier==="preview" && (
            <div className="no-print" style={{marginTop:26, background:"rgba(184,150,79,.08)", border:`1px solid ${T.gold}`, borderRadius:10, padding:"22px", textAlign:"center"}}>
              <div style={{fontFamily:T.serif, fontSize:17, marginBottom:8}}>{t("这是免费版命盘初阅")}</div>
              <div style={{fontSize:13.5, color:T.ink2, marginBottom:16, lineHeight:1.8}}>{t("完整版涵盖十六项主题：大运流年、事业财运、感情婚姻、健康养生、择日建议等，一次付费，即时生成")}</div>
              <button onClick={goPay} style={primaryBtn2}>{t("解锁完整命盘报告 · S$68")}</button>
            </div>
          )}

          {tier==="full" && (
            <div style={{marginTop:22, textAlign:"center", fontSize:12.5, color:T.muted, fontFamily:T.ui}}>
              {t("报告已寄送到你的信箱，也可以用上方按钮下载 PDF；此报告不会自动保存在网站上。")}
            </div>
          )}
        </>
      )}
    </div>
  );
}
const primaryBtn2 = { background:T.tea, color:"#fff", border:"none", borderRadius:6, padding:"12px 30px", fontSize:14.5, fontFamily:T.ui, cursor:"pointer" };

/* ═══════════════════════════ 主入口 ═══════════════════════════ */
function GGHBSite(){
  const { t, language, setLanguage } = useLanguage();
  const params = new URLSearchParams(window.location.search);
  const paidRedirect = params.get("paid")==="true";
  const savedForm = (()=>{ try{ return JSON.parse(sessionStorage.getItem("gghb_form")||"null"); }catch{ return null; } })();

  const [view, setView] = useState(paidRedirect && savedForm ? "report" : "home");
  const [formData, setFormData] = useState(paidRedirect && savedForm ? savedForm : null);

  return (
    <div style={{minHeight:"100vh", background:T.paper, color:T.ink, fontFamily:T.bodySerif}}>
      <nav className="language-switch no-print" aria-label="Language / 语言">
        <span className="language-brand">果甘半壶 · GGHB</span>
        <div role="group" aria-label="Language / 语言">
          <button type="button" lang="zh-Hans" aria-pressed={language === "zh"} onClick={()=>setLanguage("zh")}>中文</button>
          <button type="button" lang="en" aria-pressed={language === "en"} onClick={()=>setLanguage("en")}>English</button>
        </div>
      </nav>
      {view==="home" && <Home onStart={()=>setView("intake")}/>}
      {view==="intake" && <Intake onSubmit={(f)=>{setFormData(f); setView("report");}} onBack={()=>setView("home")}/>}
      {view==="report" && formData && (
        <Report form={formData} onBack={()=>setView("intake")} initialTier={paidRedirect ? "full" : "preview"}/>
      )}
      {paidRedirect && !savedForm && (
        <div style={{maxWidth:480, margin:"0 auto", padding:"90px 24px", textAlign:"center"}}>
          <div style={{fontFamily:T.serif, fontSize:20, marginBottom:12}}>{t("找不到你的命盘资料")}</div>
          <div style={{fontSize:14, color:T.muted, marginBottom:24, lineHeight:1.8}}>
            {t("可能是换了浏览器或清除了资料。请重新填一次出生资料，完成后联系我们，我们会协助核实付款并补发完整报告。")}
          </div>
          <button onClick={()=>{ window.location.href = `${window.location.pathname}?lang=${language}`; }} style={primaryBtn}>{t("重新填写")}</button>
        </div>
      )}
    </div>
  );
}

export default function App(){ return <LanguageProvider><GGHBSite /></LanguageProvider>; }
