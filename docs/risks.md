# 已知风险

按「影响 × 可能性」排序，含缓解措施。编号可被 backlog 引用。

## 高影响

### R-01 GA4 上报 theme 参数违反原始 PRD（已修复，待部署生效）
- **现象**：`generate_verse` / `select_theme` 曾上报 `theme` 参数。原始 PRD「Privacy / GA4」明确要求 *"Never send … theme … Theme names are not user-level params"*，隐私页也称「topics never collected」——代码同时违背 PRD 与隐私页。
- **影响**：信任 / 合规风险。
- **缓解**：已按 backlog B-01 移除 `theme` 参数，只保留通用事件计数；`npm run deploy` 后线上生效。

### R-02 USFM 解析器脆弱，且校验无法自证
- **现象**：`usfm.mjs` 是最小实现；`validate.mjs` 与 `build-data.mjs` 共用同一解析器，解析器级错误两边一起错，校验会误判「通过」。
- **影响**：经文文本可能与官方源不一致（尤其脚注、诗歌排版、特殊 marker）。
- **缓解**：不定期抽查官网逐字比对；给解析器补单元测试（B-08）；源文件升级后全量复查。

### R-03 原始数据源不在仓库
- **现象**：`data/raw/usfm/`（约 19 MB）被 gitignore，仓库里只有生成结果。
- **影响**：换机器 / 仓库丢失后无法复现构建，需重新下载。
- **缓解**：README 记录下载源 `https://ebible.org/engwebp/`；`data:build` 可重跑但需先恢复源文件。

## 中影响

### R-04 社交平台缓存分享图
- **现象**：FB / X 会长期缓存 `og-image.png`，改了图不主动刷就不更新。
- **缓解**：见 B-03，用官方调试器手动刷；重要改版后必刷。

### R-05 手写 sitemap / robots 易漂移
- **现象**：`sitemap.xml`、`robots.txt` 手写，新增页面后不会自动更新。
- **缓解**：加页面时同步更新 sitemap；将来页面多可改为构建时生成。

### R-06 部署 / Git 环境依赖机器配置
- **现象**：本机访问 GitHub 依赖本地代理 `127.0.0.1:40808`；Node 版本靠 `.node-version` 固定（22.22.0）。换机器/代理失效会导致无法 push/deploy。
- **缓解**：环境说明已记入记忆；CI 化（B-07）可降低对单机部署的依赖。

### R-07 域名 / DNS / 重定向为云端手工配置
- **现象**：Cloudflare zone、NS、`www` CNAME + Redirect Rule、Worker 自定义域名绑定均为控制台手工配置，无配置文件。
- **影响**：误删或账号异常后需手工重建。
- **缓解**：将关键配置抄录进文档或备份；定期截图 / 记录。

## 低影响

### R-08 纯静态架构限制
- **现象**：任何需要服务端的功能（账户、云端收藏、服务端随机、全本搜索）都超出当前架构。
- **缓解**：动工前先读 [boundaries.md](boundaries.md)，明确是否需要引入后端。

### R-09 单点维护（bus factor）
- **现象**：单人维护，知识集中在对话记忆与本文档。
- **缓解**：本文档即交接物；关键决策继续沉淀到 `docs/`。
