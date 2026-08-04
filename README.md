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

## 第三步：换成你自己的网址（选用）

Netlify 后台 → "Domain settings" → "Add a domain"，
如果你已经买了自己的域名（例如 gghb.com），可以在这里绑定；
如果还没有，暂时先用 Netlify 给的免费网址（`xxx.netlify.app`）也完全能用。

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
- AI 自动撰写一段命盘初阅（约350-450字）
- 金钥安全地藏在 Netlify 后端，不会暴露在网页原始码里

**还没做到，需要你决定下一步怎么走：**
- **紫微斗数没有自动化**——十二宫星曜排法工程量大很多，目前建议做法是客户上传自己排盘软件的截图，
  由人工或 AI 辅助解读，而不是网站自己算
- **付费按钮目前是假的**——按下去不会真的收钱，要接你自己申请的 Stripe 或 PayNow 收款连结才行
- **完整版报告（十六章）还没做**——现在只有约400字的免费初阅，完整版需要另外设计成多段式生成
  （逐段呼叫 API 拼起来），这个我可以在下一步帮你做
- **节气边界±1-2天可能不准**——用的是常见的近似节气日期表，卡在交界的生日建议人工复核；
  要做到分钟级精确，需要换成天文历算法

---

有任何一步卡住，把看到的错误讯息截图给我，我可以帮你排查。
