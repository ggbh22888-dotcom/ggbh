# 果甘半壶 GGHB · 八字命盘网站

这是一个可以真正部署上线的网站专案：客户填出生资料 → 网站自动排八字四柱 →
呼叫 AI 撰写命盘初阅 → 显示免费预览＋付费解锁按钮。

用的技术：React + Vite（前端）、Netlify Functions（后端，负责安全地保管 API 金钥）。

---

## 部署前，你需要准备两样东西

1. **一个 GitHub 帐号**（免费）—— 用来放这份程式码，Netlify 会读取这个仓库自动部署。
   还没有的话，先到 https://github.com/signup 注册。

2. **一把 Anthropic API 金钥** —— 让网站能呼叫 Claude 来写报告。
   到 https://console.anthropic.com 注册/登入 → 左侧 "API Keys" → "Create Key"，
   复制那一长串以 `sk-ant-` 开头的字串，先存起来备用（等一下会用到）。
   这个金钥关系到你的 API 用量费用，不要分享给任何人，也不要贴在群组、笔记软件等公开可见的地方。

---

## 第一步：把这份程式码上传到 GitHub（不需要用任何指令）

1. 打开 https://github.com/new ，建立一个新仓库（Repository）。
   - Repository name 随便取，例如 `gghb-website`
   - 选择 "Private"（不公开也没关系，Netlify 一样能读取）
   - 不要勾选 "Add a README file"（我们自己的资料夹里已经有了）
   - 按 "Create repository"

2. 建好之后，页面会出现 "uploading an existing file" 的连结，点进去
   （或者在仓库首页找 "Add file" → "Upload files"）。

3. 把你收到的这个专案资料夹**里面的所有档案和资料夹**，整个拖进网页的上传区域。
   （注意：是把资料夹「里面的东西」拖进去，不是整个资料夹本身；
   `node_modules` 这个资料夹如果有的话不用上传，档案很大且不需要）

4. 拖完之后，网页最下面按 "Commit changes"。完成。

---

## 第二步：把 GitHub 仓库接到 Netlify

1. 登入你已经注册好的 Netlify 帐号：https://app.netlify.com

2. 按 "Add new site" → "Import an existing project" → 选 "Deploy with GitHub"
   （第一次用需要授权 Netlify 存取你的 GitHub，跟着画面指示按几次「同意」就好）

3. 从列表里选刚才建立的仓库（例如 `gghb-website`）

4. Build 设定网页会自动侦测到（因为专案里已经放了 `netlify.toml`），
   通常长这样，不用改：
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **先不要按 Deploy**，往下滚，找到 "Environment variables"，按 "Add a variable"：
   - Key 填：`ANTHROPIC_API_KEY`
   - Value 填：刚才复制的那把 `sk-ant-` 开头的金钥
   - 按 "Create variable"

6. 确认加好环境变量之后，按 "Deploy [仓库名]"

7. 等 1-2 分钟，Netlify 会显示一个网址，例如 `random-name-12345.netlify.app`
   —— 打开它，网站就是活的了。

---

## 第三步：接上寄信服务（Resend）—— 用来寄报告给客户＋建立你的邮箱名单

1. 到 https://resend.com 注册帐号（有免费额度：每月3000封信、名单最多100人，够起步用）
2. 左侧选单 **"API Keys"** → **"Create API Key"**，复制那把金钥
3. 左侧选单 **"Audiences"**（或显示为 "Segments"，是同一个功能改了名字）→ **"Create Audience"**，
   建一个名单，例如叫「GGHB 潜在客户」，建好后网址列会看到一串 ID（形如 `78261eea-8f8b-...`），复制起来
4. **域名验证（重要，会影响能不能寄给客户）**：
   - 左侧选单 **"Domains"** → **"Add Domain"**，照指示把几笔 DNS 记录加到你的域名服务商后台
   - **如果你还没有自己的域名**：可以先跳过这步，Resend 提供一个测试用地址 `onboarding@resend.dev`，
     但这个地址**只能寄给你自己注册 Resend 时用的那个信箱**，没办法寄给真正的客户。
     也就是说，在你有自己的域名并完成验证之前，这个寄信功能只能自己测试用，还不能正式上线给客户用。
5. 回到 Netlify 后台 → Site configuration → Environment variables，新增三个变量：
   - `RESEND_API_KEY` = 刚才复制的金钥
   - `RESEND_AUDIENCE_ID` = 刚才复制的名单 ID
   - `RESEND_FROM` = 寄件人地址，格式是 `名称 <邮箱>`，例如 `GGHB <hello@yourdomain.com>`
     （还没有自己域名前，先填 `GGHB <onboarding@resend.dev>` 做测试）

做完这五步，客户填完资料、看完报告后，系统会自动：
把报告寄一份到客户的信箱 → 同时把客户的邮箱加进你 Resend 后台的名单里。
打开 Resend 后台的 Audience 页面，就能看到所有留过资料的人，可以匯出成 CSV 自己保存。

**关于同意收营销信这件事**：网站的填资料表单里有一个「愿意收到命理资讯与优惠」的勾选框，
没勾的人一样会收到报告（这是他们要的东西），但会在 Resend 后台被标记成"不接受广播信"，
之后你用 Resend 群发促销邮件时，只会寄给真的勾选同意的人——这是为了符合新加坡 PDPA
（个人资料保护法）对营销邮件需要明确同意的要求，请不要把这个开关拿掉。

---

## 第四步：换成你自己的网址（选用）

Netlify 后台 → "Domain settings" → "Add a domain"，
如果你已经买了自己的域名（例如 gghb.com），可以在这里绑定；
如果还没有，暂时先用 Netlify 给的免费网址（`xxx.netlify.app`）也完全能用。

---

## 收款怎么接（这次改成「一次性付费 S$68」，不是订阅制）

1. 登入 https://dashboard.stripe.com
2. 左侧选单找 **"Payment links"**（付款连结）→ **"Create payment link"**
3. 建一个商品：名称填「果甘半壶 GGHB · 完整命盘报告」，价格填 **S$68**，**一次性付款**（One time），不要选订阅
4. 建好后，进这个 Payment Link 的设定，找到 **"After payment"**（付款完成后）
   - 选 **"Redirect customers to your website"**
   - 网址填：`https://你的网站网址/?paid=true`
     （网址最后的 `?paid=true` 一定要保留，网站是靠这个自动判断"这个人付过钱了，直接生成完整报告"）
5. 复制这个 Payment Link 的网址（长得像 `https://buy.stripe.com/xxxxx`）
6. 打开 `src/App.jsx`，找到最上面写着 `STRIPE_PAYMENT_LINK` 的那一行，把网址换成你刚复制的
7. 存档、重新上传到 GitHub，Netlify 会自动重新部署

**这个流程的运作方式（讲清楚，方便你判断够不够用）：**
客户填资料 → 看到免费预览 → 按"解锁完整报告"→ 跳到 Stripe 付款页 → 付完钱 → Stripe 自动把客户带回你的网站（网址带着 `?paid=true`）→ 网站侦测到这个，直接生成完整版报告给他看。

**目前这个做法的限制，老实说清楚：**
- 没有帐号密码系统，但客户填资料时会留邮箱，报告完成会自动寄一份给他，等于有了备份，不一定要靠截图
- 判断"这个人是否真的付款成功"目前是靠"有没有从 Stripe 正确跳转回来"，理论上有心人可以用同一个网址上如果他猜到 `?paid=true` 这段直接绕过付款（一般客户不会这样做，但如果你介意，之后可以升级成透过 Stripe API 真正核实付款状态，这个我可以之后帮你做）



以后要改文字、改价格、加新功能，流程是：
1. 修改档案（可以直接在 GitHub 网页上编辑，或请人帮你改）
2. 存档（Commit）
3. Netlify 会自动侦测到 GitHub 有变动，几十秒内自动重新部署，不用手动做任何事

---

---

## 之后要更新网站内容怎么办？

以后要改文字、改价格、加新功能，流程是：
1. 修改档案（可以直接在 GitHub 网页上编辑，或请人帮你改）
2. 存档（Commit）
3. Netlify 会自动侦测到 GitHub 有变动，几十秒内自动重新部署，不用手动做任何事

---

## 目前这个版本做到了什么、还没做到什么

**已经能用：**
- 八字四柱自动排盘（年月日时，公式已反复验证）
- 五行/十神/身强身弱/用神自动判断
- AI 自动撰写免费预览（约350-450字）
- **付费流程：客户填资料→免费预览→按「解锁完整报告」→跳转到你的 Stripe 付款连结→付款完成自动跳回网站→AI 生成完整版报告（七大主题，约1800-2400字）**
- **邮件自动寄送：报告生成后自动寄一份到客户信箱（用 Resend），同时把邮箱加进你的联络人名单**
- **下载 PDF：报告页面有「下载/打印 PDF」按钮，用浏览器内建功能另存**
- **PDPA 合规的营销同意勾选**：客户可选择是否愿意收到之后的促销信件
- 金钥安全地藏在 Netlify 后端，不会暴露在网页原始码里

**还没做到，需要你决定下一步怎么走：**
- **紫微斗数没有自动化**——十二宫星曜排法工程量大很多，目前建议做法是客户上传自己排盘软件的截图，
  由人工或 AI 辅助解读，而不是网站自己算
- **付款验证是靠信任跳转网址，不是真正核实付款状态**——细节见上面「收款怎么接」那一节的说明
- **邮件目前是排版好的 HTML 邮件，不是真正的 PDF 附件**——多数信箱看起来跟正式文件一样，但如果你
  坚持要邮件里附一个可下载的 PDF 档案，这个可以做，工程量会明显增加
- **节气边界±1-2天可能不准**——用的是常见的近似节气日期表，卡在交界的生日建议人工复核；
  要做到分钟级精确，需要换成天文历算法

---

有任何一步卡住，把看到的错误讯息截图给我，我可以帮你排查。
