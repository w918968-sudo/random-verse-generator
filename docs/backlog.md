# 待办事项（Backlog）

优先级说明：

- **P0** — 正确性 / 一致性问题，应尽快处理
- **P1** — 高价值、低成本，近期做
- **P2** — 中期增强
- **P3** — 探索性，可能涉及架构改动

每条均含**验收标准**（完成后如何判定「做对了」）与**推荐优先级**。

---

## P0 — 正确性与一致性

### B-01 移除 GA4 事件中的 theme 参数（对齐原始 PRD）✅ 已完成 2026-10-17
**问题**：`VerseGenerator.astro` 中 `generate_verse` 与 `select_theme` 事件会上报 `theme` 参数（即用户所选主题）。这同时违反两处：原始 PRD「Privacy / GA4」明确要求 *"Never send verse text/reference/theme/user input to GA4 … Theme names are not user-level params"*；且 `privacy.astro` 声称「chosen topics … never collected」。
**方案（唯一正确做法）**：移除事件中的 `theme` 参数，只保留通用事件计数（generate / select 本身），不携带主题或任何用户输入。
**验收标准**：
- `generate_verse`、`select_theme` 事件不再携带 `theme` 或任何主题/经文相关参数；
- privacy 页文案无需改动；代码行为与 PRD、隐私页三者一致。

**推荐优先级**：P0（PRD 合规 + 信任风险）。
**状态**：已改 `track('generate_verse')` / `track('select_theme')` 为无参数调用，build 通过，已部署生效（2026-10-17）。

### B-02 清理遗留 `.og-previews/` ✅ 已完成 2026-10-17
**问题**：`docs` 之外存在未跟踪、未 ignore 的预览文件 `.og-previews/variants-in-context.html`，是早前分享图选型时的临时产物。
**验收标准**：
- 删除该目录（或将 `.og-previews/` 加入 `.gitignore`）；
- `git status` 干净，无 `?? .og-previews/`。

**推荐优先级**：P0（仓库卫生）。
**状态**：已删除 `.og-previews/`，`git status` 不再出现。

### B-03 刷新社交分享图缓存 ✅ 已完成 2026-10-17
**问题**：`og-image.png` 已更换为「米纸底居中」版，但 Facebook / X 会长期缓存旧图。
**验收标准**：
- 用 [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) 抓取首页，预览显示新分享图；
- 用 [X Card Validator](https://cards-dev.twitter.com/validator) 验证 `summary_large_image` 显示新图。

**推荐优先级**：P0（对外展示一致性）。
**状态**：FB 抓取 200、og:image 已取到（`fb:app_id` 为可忽略警告）；X 验证 `Card loaded successfully`。两平台缓存均已刷新。

---

## P1 — 近期增强

### B-04 跑完整浏览器验收清单 ✅ 已完成 2026-10-17
**描述**：按 [testing.md](testing.md) 的验收清单，在桌面 + 移动 + 键盘 + 屏幕阅读器逐项过一遍。
**验收标准**：
- 清单所有项通过；发现的问题要么修复、要么登记为新的 backlog 条目。

**推荐优先级**：P1。
**状态**：用户 2026-10-17 验收通过，无问题（重点验了分享按钮、`?theme=` 深链、移动端 375px）。

### B-05 分享 / 复制链接按钮 ✅ 已完成 2026-10-17
**描述**：经文卡增加「分享」按钮。优先 `navigator.share`（移动端），不支持时回退到复制链接；链接带 `?theme=Hope` 参数，打开后预选主题。
**验收标准**：
- 点击后能调起系统分享或复制出 `https://randomversegenerator.info/?theme=<主题>`；
- 带 `?theme=` 打开页面时，对应主题按钮处于选中态（`aria-pressed="true"`）；
- 不破坏现有复制按钮行为。

**推荐优先级**：P1。
**状态**：已加 `share-btn` + `shareVerse()`（`navigator.share` → clipboard 回退，上报通用 `share_verse`），并加 `applyUrlTheme()` 解析 `?theme=` 预选。已部署生效（2026-10-17，Version `7d98ae97`）。

### B-06 复制经文时附带出处（❌ 已取消 2026-10-17）
**描述**：原本提议复制时附带引用。经确认，**保持原始 PRD**：Copy 只复制经文文本（不含引用/主题/按钮文字）。当前代码已符合，无需改动。
**决定**：2026-10-17 用户确认「保持只复制经文」，本项取消。

### B-07 CI 流水线（GitHub Actions）✅ 已完成 2026-10-17
**描述**：push / PR 时自动跑 `npm ci && npm run data:validate && npm run build`。
**验收标准**：
- PR 出现构建/校验状态；`data:validate` 失败或 build 失败会阻塞合并；
- CI 不执行 `deploy`（部署仍手动）。

**推荐优先级**：P1。
**状态**：已加 `.github/workflows/ci.yml`（checkout → setup-node(用 `.node-version`) → `npm ci` → `data:validate` → `npm test` → `build`）。同时让 `validate.mjs` 在缺少 `data/raw/usfm/`（gitignore）时优雅降级为结构性检查，CI 干净克隆可用。首次 push 后观察运行结果。

### B-08 USFM 解析器单元测试 ✅ 已完成 2026-10-17
**描述**：为 `scripts/usfm.mjs` 补单元测试，覆盖脚注/交叉引用删除、诗歌换行、Strong's/词条属性剥离、未知 marker 防御、跨行续写。
**验收标准**：
- 用真实 WEBP 片段做 fixtures，断言输出文本；
- 测试可在 CI 中运行（需先引入测试运行器，如 `node:test` 或 vitest）。

**推荐优先级**：P1。
**状态**：已加 `test/usfm.test.mjs`（12 个用例，`node:test` 零依赖）+ `package.json` 的 `test` 脚本，全绿，已并入 CI。

---

## P2 — 中期增强

### B-09 扩充经文库 ✅ 已完成 2026-10-17
**描述**：从 88 条扩到 ~150–200 条，保持 8 主题均衡（每主题 ≥8，validate 已强制）。
**验收标准**：
- 每个主题条目数 ≥8，主题间数量差距 ≤ 若干条；
- `npm run data:build && npm run data:validate` 全绿；
- 新增引用在 WEBP 源中存在，文本逐字一致。

**推荐优先级**：P2。
**状态**：扩充到 **155 条**，主题分布 Hope 22 / Peace 20 / Love 21 / Strength 22 / Faith 22 / Comfort 22 / Wisdom 22 / Gratitude 22（差距 ≤2）。`data:build` + `data:validate` 全绿（文本逐字比对），已部署（Version `fd523e33`）。

### B-10 深色模式 ✅ 已完成 2026-10-17
**描述**：基于 `prefers-color-scheme` 提供深色 token 变体。
**验收标准**：
- 系统深色时自动切换，对比度满足可读性；
- 卡片、按钮、分享图不受影响；浅色保持现状。

**推荐优先级**：P2。
**状态**：在 `global.css` 增加 `@media (prefers-color-scheme: dark)` token 覆盖（暖炭黑底 `#17130E`、表面 `#221C15`、亮墨 `#EDE7DA`），并解耦 `--color-primary`（文本强调）与新增 `--color-primary-solid`/`--color-on-primary`/`--color-primary-hover`/`--color-primary-soft`（实心按钮背景/其上文字/悬停/次级悬停）以在深色下分别保持对比度；`color-scheme` 同步切 dark 使滚动条/控件匹配。浅色 token 未变（视觉零回归）。分享图/ favicon 为静态文件不受影响。build + 12 测试全绿。已部署生效（2026-10-17，Version `14444403`）。

### B-11 PWA / 添加到主屏幕 ✅ 已完成 2026-10-17
**描述**：加 `manifest.json` + service worker，离线可开、可「添加到主屏幕」。
**验收标准**：
- Lighthouse PWA 项可安装；离线刷新页面工具仍可用（经文数据已缓存）；
- 不影响现有静态部署（sw 需随构建生成，注意缓存失效策略）。

**推荐优先级**：P2。
**状态**：新增 `public/manifest.webmanifest`（standalone + 192/512/maskable 图标）、`scripts/generate-icons.mjs`（`npm run icons`，从 favicon.svg 用 sharp 生成 4 个 PNG：192/512/全出血 maskable 512/apple 180）、`scripts/build-sw.mjs`（构建后扫描 `dist/` 生成 `dist/sw.js`，全部 147 个文件预缓存，缓存名 `versewell-<contenthash>` 按内容哈希失效）。SW 策略：导航与 `/data/*` 网络优先（在线始终最新、离线回退缓存）、哈希静态资源缓存优先；`install` skipWaiting、`activate` 清旧缓存。`build`/`deploy` 脚本串联 sw 生成；注册脚本在 `Layout.astro` 内联且 `import.meta.env.PROD` 门控（开发环境不注册）。浅色/深色 `theme-color` meta 各自匹配。build + 12 测试全绿。已部署生效（2026-10-17，Version `9bcb1d5d`）；线上 `/sw.js`（text/javascript）、`/manifest.webmanifest`（application/manifest+json）、图标均 200。

### B-12 中文界面（i18n）❌ 已取消 2026-10-17
**描述**：新增 `src/i18n/zh.mjs`，UI 字符串切中文；经文仍为英文 WEBP。
**决定**：2026-10-17 用户取消——后续不一定要做中文，可能整体偏向海外（英文）受众。UI 已集中在 `src/i18n/`，将来若需要可低成本重启。
**验收标准**：
- 语言可切换（`?lang=zh` 或按钮），所有 UI 文案来自 zh.mjs，无硬编码；
- 中文页仍正确渲染经文（英文）+ 引用格式。

**推荐优先级**：P2。

### B-13 经文朗读 ✅ 已完成 2026-10-17
**描述**：经文卡加「朗读」按钮，用 Web Speech API 朗读。
**验收标准**：
- 点击朗读当前经文，再次点击停止；
- 不支持的浏览器隐藏或禁用按钮。

**推荐优先级**：P2。
**状态**：在 `verse-actions` 行加 `speak-btn`（`aria-pressed` 切换态，标签在 Read Aloud / Stop 间切换）；`speakVerse()` 用 `SpeechSynthesisUtterance`（`lang='en-US'`）朗读 `currentVerse.text`，`onend`/`onerror` 复位；再次点击或 `generate()` 时 `cancelSpeech()`。不支持 `speechSynthesis` 时按钮 `hidden`。上报通用 `read_aloud` 事件（无经文/主题参数，符合隐私）。build + 12 测试全绿。待部署。

---

## P3 — 探索性（可能涉及架构改动）

### B-14 每日经文（Verse of the Day）✅ 已完成 2026-10-17
**描述**：按日期做确定性种子，每天固定一条，URL 形如 `/verse-of-the-day`，SEO 友好。
**验收标准**：
- 同一天同一 URL 结果稳定；次日自动更换；
- 该页有独立 canonical 与结构化数据（可考虑 `Dataset`/`WebPage`）。

**推荐优先级**：P3。
**状态**：新增 `src/lib/verse-of-day.mjs`（FNV-1a 哈希 `hashString` + `todayUTC()` 取 UTC 日期 `YYYY-MM-DD` + `verseForDate(date,verses)` + `reference()`），构建期与客户端复用同一算法保证一致。新增 `src/pages/verse-of-the-day.astro`：构建期预渲染当日经文（SEO + 无 JS 回退），客户端 `refreshToday()` 拉 `/data/verses.json` 按实际访问日期重算并替换 DOM，故无需每日重建即自动换经文。含 `WebPage` JSON-LD（name/url/description/dateModified/about）。页脚与 `sitemap.xml` 加入 `/verse-of-the-day/`（`changefreq=daily`）。build 5 页 + 12 测试全绿。待部署。

### B-15 经文收藏（localStorage）✅ 已完成 2026-10-17
**描述**：本地收藏经文，无需账户。
**验收标准**：
- 收藏/取消收藏即时生效，刷新后保留；
- 隐私页补充说明「收藏仅存于本机」。

**推荐优先级**：P3。
**状态**：verse-actions 加 `fav-btn`（Save Verse ↔ Saved，`aria-pressed` 切换）；action-row 加 `favorites-btn` + 可折叠 `favorites-panel`（`<ul>` 列表，可点击重开 / `×` 移除）。`favorites[]` 持久化到 `localStorage`（key `versewell.favorites`，存完整经文对象含 `usedTheme`）；`loadFavorites()` 初始化、`saveFavorites()` 写入、`renderFavButton()` 同步按钮态（并入 `renderCard()`）。上报通用 `add_favorite`/`remove_favorite`（无经文/主题参数）。隐私页新增「Saved verses (local storage)」说明仅存本机。build 5 页 + 12 测试全绿。待部署。

### B-16 全文搜索 / 全章浏览
**描述**：支持按关键词搜索或浏览任意章节。
**验收标准**：
- 搜索返回相关经文与引用，点击可看全章；
- 数据策略需先定：打包更多章节 vs 引入后端（见 [boundaries.md](boundaries.md)）。

**推荐优先级**：P3。

### B-17 多译本
**描述**：增加 KJV（公版）等译本，可切换。
**验收标准**：
- 数据管线支持多 `translationId`，UI 可切换译本；
- 每个新增译本完成许可证审查，版权声明正确展示。

**推荐优先级**：P3。

---

## 补充 — 来自 v1 需求文档「Explicitly NOT in v1」的迭代任务

> 以下四项源于原始 PRD 末尾「明确不在 v1」的清单，属规划好的迭代方向，此前遗漏，现补上。

### B-18 经文卡片图（verse images）✅ 已完成 2026-10-17
**描述**：为当前经文生成一张可保存/分享的图片卡（经文文本 + 引用 + VerseWell 品牌），供用户下载或分享。
**验收标准**：
- 一键生成含经文、引用、品牌的清晰图片（如 1080×1350 或 1200×630）；
- 支持下载或调起系统分享，纯客户端实现（canvas 或预渲染模板），不引入后端；
- 不同主题/多节经文下排版仍可读。

**推荐优先级**：P2。
**状态**：verse-actions 加 `image-btn`（Save Image）。`renderVerseImage()` 用 canvas 生成 1080×1350 PNG：米纸底 `#F7F3EA` + 顶部金线 + 经文（Georgia，字号自动缩小适配长经文、按 `\n` 分段换行）+ 引用 + 主题徽章（如有）+ 底部 VerseWell 字标 + 金线。`saveVerseImage()` 优先 `navigator.canShare({files})` 调起系统分享，否则 `<a download>` 下载；文件名 `versewell-<bookId>-<chapter>-<startVerse>.png`。上报通用 `verse_image`。build + 12 测试全绿。待部署。

### B-19 生成历史（history）✅ 已完成 2026-10-17
**描述**：记录本次会话内生成过的经文，可回看。
**验收标准**：
- 会话内最近 N 条可回看、可重新打开（复制 / 上下文 / 全章）；
- 刷新后清空（遵循 v1「no localStorage」默认；若改为持久化需同步更新隐私页）。

**推荐优先级**：P2。
**状态**：action-row 加 `history-btn`（History，无历史时隐藏）+ 可折叠 `history-panel`（`<ol>` 列表）。会话内 `history[]` 内存数组（上限 8，`unshift`+`pop`），每次 `generate()` 记录、`renderHistory()` 重绘；刷新即清空（无 localStorage）。点击历史项 `openHistoryItem()` 重新打开该经文（可继续复制/上下文/全章/朗读/图片）。列表项用 `textContent` 渲染（无注入风险）。build + 12 测试全绿。待部署。

### B-20 多主题筛选（multi-topic filter）✅ 已完成 2026-10-17
**描述**：允许同时勾选多个主题，结果取所选主题的并集。
**验收标准**：
- 可多选主题，结果为所选主题并集且无重复；
- 至少选中一个主题才可生成；全不选时回退为 All；
- 主题按钮 `aria-pressed` 正确反映多选状态。

**推荐优先级**：P2。
**状态**：单选 `currentTheme` 改为多选 `selectedThemes`（`Set`，空=All）。`currentPool()` 取并集（`v.themes.some(t => selectedThemes.has(t))`），`poolKey()` 用排序主题 id 作洗牌袋键；`draw()` 无参化。`syncThemeButtons()` 同步 `aria-pressed`（All 仅在空选时按下）。`applyUrlTheme()` 支持 `?theme=A,B` 逗号多选；`shareVerse()` 序列化多选。徽章显示命中主题（多选用 ` · ` 连接）。主题组 label 改 "Choose one or more topics"。build + 12 测试全绿。待部署。

### B-21 各主题独立 SEO 页面（per-theme SEO pages）
**描述**：为每个主题建落地页（如 `/hope/`），预选该主题 + 专属 SEO 文案，捕获长尾搜索。
**验收标准**：
- 每个主题一个 URL，canonical 唯一，title/meta/H1 针对该主题；
- 打开即预选该主题并显示该主题经文；
- sitemap 同步收录所有主题页。

**推荐优先级**：P3。

### B-22 云端神经 TTS（感情化朗读，升级 B-13）
**描述**：把 B-13 的本机 Web Speech 换成云端神经 TTS（如 OpenAI TTS / ElevenLabs），获得更有感情的经文朗诵。
**验收标准**：
- 音色自然、有情感，语速/音色可调；
- 不破坏离线可用（在线走云端、离线回退 Web Speech 或禁用）；
- 隐私页说明朗读可能向第三方服务发送经文文本。

**推荐优先级**：P3（需 API key + 按量付费，可能引入后端或前端直连第三方）。
**状态**：2026-10-17 用户提出后续接入，暂缓。
