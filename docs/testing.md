# 测试策略

当前站点**没有自动化 UI 测试**，只有数据校验和构建检查。本文件定义分层策略，避免为简单站点过度建设。

## 现状已有的检查

| 命令 | 覆盖 | 说明 |
| --- | --- | --- |
| `npm run data:validate` | 数据正确性 | 去重、文本==源、主题下限、规模边界、章节文件完整性 |
| `npm run build` | 构建 | 4 页静态产出、数据复制、脚本打包 |

## 分层策略（按优先级落地）

### L1 数据校验（已有，必须保持）
`validate.mjs` 是数据质量的最后防线。**新增/修改 `verse-selections.mjs` 后必须重跑**。

**已知局限**：校验与构建共用同一个 `usfm.mjs` 解析器，因此能抓住「构建产物与源漂移」，但抓不住「解析器本身解析错」（两边用同一段代码）。**缓解**：不定期随机抽查 3–5 条经文，与 eBible.org 官网对应章节逐字比对。

### L2 单元测试（建议补，见 B-08）
针对纯函数：
- `scripts/usfm.mjs`：`parseBook` / `extractRange` / `removeNotes` / `cleanSegment`（脚注、交叉引用、诗歌换行、Strong's 属性、未知 marker）
- 客户端 `draw()` 洗牌袋逻辑（需先抽离出可测的纯函数，或引入 vitest + 轻量 DOM）

运行器用 Node 内置 `node:test`（零依赖）或 vitest。

### L3 组件/交互（可选）
- 经文卡渲染、主题切换、复制回退、上下文/全章开关。
- 用 Playwright 比 jsdom 更接近真实浏览器，性价比更高，可直接并入 L4。

### L4 端到端冒烟（建议补，见 B-07 之后）
Playwright 一条主路径冒烟：

1. 打开首页 → 自动出现经文（无需点击）
2. 切到某主题 → 再点 Generate → 经文属于该主题、无连续重复
3. Copy → 剪贴板含文本
4. Read Context → 出现 ±2 节；Read Full Chapter → 整章渲染并滚动定位
5. 移动视口（375px）下无横向溢出

### CI（建议，见 B-07）
GitHub Actions：`npm ci → npm run data:validate → npm run build`（可选再跑 L4）。**部署保持手动**。

## 浏览器验收清单（手动，交付前必过）

- [ ] 打开即显示一段经文，无报错
- [ ] 8 个主题 + All 各点一遍，经文随主题变化、主题徽章正确
- [ ] 连续多次 Generate 无立即重复
- [ ] Copy 成功且提示「Copied!」；失败时出现手动复制提示
- [ ] Read Context 展开 ±2 节；Read Full Chapter 整章渲染并定位到当前段；Collapse 收起
- [ ] 键盘：Tab 顺序合理，`:focus-visible` 可见，按钮可用 Enter/Space 触发
- [ ] 屏幕阅读器：主题按钮读 `aria-pressed`，结果有 `aria-live` 播报
- [ ] 移动端（375px）：无横向滚动，按钮可点
- [ ] 控制台无报错；GA4 事件在 tag 面板出现（若开启）
- [ ] robots/sitemap/canonical/OG 标签在线上源码中正确
