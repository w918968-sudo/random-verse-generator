# 架构说明

## 1. 总体形态

一个**纯静态、无后端**的 Astro 站点。核心工具完全在浏览器里运行，不依赖任何服务端逻辑。

```
┌─────────────────────────────────────────────────────────────┐
│  浏览器（客户端）                                              │
│  VerseGenerator.astro 内联脚本                                │
│    · 拉取 /data/verses.json → 本地洗牌袋抽签                    │
│    · 拉取 /data/chapters/<book>/<ch>.json → 上下文 / 全章       │
│    · window.gtag() → GA4 事件（可选）                          │
└─────────────────────────────────────────────────────────────┘
              ↑ 静态文件（Cloudflare Workers 静态托管）
┌─────────────────────────────────────────────────────────────┐
│  dist/（构建产物，120 个文件）                                  │
│  index / about / privacy / contact 四页 HTML                   │
│  /data/verses.json + /data/chapters/**/*.json                  │
│  favicon.svg / og-image.png / robots.txt / sitemap.xml        │
└─────────────────────────────────────────────────────────────┘
```

## 2. 目录结构

```
src/
  config.mjs                  站点配置唯一来源（URL/邮箱/GA4/Search Console/译本）
  i18n/en.mjs                 UI 字符串 + THEMES + faq（集中管理，便于将来多语言）
  layouts/Layout.astro        头部 meta + GA4 + 页脚（所有页面共用）
  pages/
    index.astro               首页：工具 + SEO 文案 + FAQ + JSON-LD
    about.astro / privacy.astro / contact.astro
  components/VerseGenerator.astro   核心交互（内联脚本）
  styles/global.css           设计 token + 全部样式

scripts/
  books.mjs                   bookId → 显示名（66 卷）
  usfm.mjs                    USFM 解析器（parseBook / extractRange）
  verse-selections.mjs       人工精选的经文引用 + 主题（数据来源）
  build-data.mjs              USFM 源 → public/data/（verses.json + 章节文件）
  validate.mjs                数据质量校验
  generate-og-image.mjs       SVG → PNG 分享图（sharp）

public/
  data/verses.json            88 条经文（提交进 git）
  data/chapters/<bookId>/<ch>.json   76 个章节文件（懒加载，提交进 git）
  favicon.svg / og-image.png / robots.txt / sitemap.xml

data/raw/usfm/                WEBP 原始源文件（约 19 MB，gitignored）
```

## 3. 数据管线（离线构建）

经文文本**从不手打**，构建时从官方 WEBP USFM 源提取，保证与源一致。

```
verse-selections.mjs（人工维护：引用 + 主题）
        │
        ▼
build-data.mjs ── 解析 data/raw/usfm/*.usfm（books.mjs + usfm.mjs）
        │
        ├─► public/data/verses.json      88 条（3–5 节连续经文）
        └─► public/data/chapters/<book>/<ch>.json  仅引用到的章节
        │
        ▼
validate.mjs ── 校验文本==源、去重、主题下限、规模边界、章节完整性
```

- **经文条目 id**：`<bookId 小写>-<章 3 位>-<起节 3 位>-<止节 3 位>`，例如 `psa-023-001-004`。
- **多主题**：一条经文可挂多个主题，`themes` 数组去重排序。
- **章节文件只生成被引用的章节**，按需懒加载，避免打包整本圣经。

## 4. 运行时数据流

1. 页面加载 → `Layout` 注入标题 / 描述 / canonical / OG / Twitter / JSON-LD / GA4 / Search Console。
2. `VerseGenerator` 脚本 `fetch('/data/verses.json')` → 存 `verses` 数组 → **自动调用 `generate()`**（打开即显示经文，2026-10-16 起）。
3. `draw(poolKey)` 实现**洗牌袋防重复**：
   - 每个主题（含 `All`）维护一个已洗牌的 `bag`；
   - 抽空后重新洗牌补充，并避免连续两次抽到同一条；
   - 切换主题各用各的袋子，互不干扰。
4. `renderCard()` 渲染经文卡；`track('generate_verse', { theme })` 上报 GA4。
5. 「Read Context」→ `fetch` 对应章节 JSON → 显示当前段 ±2 节；「Read Full Chapter」→ 从缓存的 `chapterData` 渲染整章并滚动定位到当前段。

## 5. 关键设计决策

| 决策 | 理由 |
| --- | --- |
| 纯静态、无后端 | 隐私友好（隐私页承诺不传经文/主题到服务器）、零运维、零成本 |
| 经文文本构建时提取 | 杜绝手打漂移，与 WEBP 源逐字一致 |
| 洗牌袋防重复 | 「无重复直到轮完一轮」比简单随机更符合产品承诺 |
| 章节按需懒加载 | 只打包被引用的 76 章，控制体积 |
| UI 字符串集中于 `i18n/en.mjs` | 为将来多语言铺路 |
| 站点配置集中于 `config.mjs` | 域名 / 邮箱 / GA4 / Search Console 一处改 |
| 手写 `sitemap.xml` / `robots.txt` | 页面少，手写可控（代价：加页面需手动同步） |

## 6. 部署

`npm run deploy` = `astro build && wrangler deploy`（assets-only）。产物上传到 Cloudflare Workers 静态资源，`.workers.dev` 源站 + 自定义域名 `randomversegenerator.info`（DNS 由 Cloudflare 托管，`www` 通过 CNAME + Redirect Rule 301 到 apex，保留路径与查询串）。

> 注意：机器访问 GitHub 需走本地代理 `127.0.0.1:40808`（环境相关，见 [risks.md](risks.md)）。
