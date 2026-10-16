# 项目文档

Random Bible Verse Generator（品牌名 **VerseWell**）的迭代文档。按主题拆分，供后续迭代、交接和评审使用。

| 文档 | 内容 |
| --- | --- |
| [architecture.md](architecture.md) | 系统架构、数据管线、运行时数据流 |
| [roadmap.md](roadmap.md) | 版本路线图与时间预期 |
| [backlog.md](backlog.md) | 待办事项，每条含验收标准 + 推荐优先级 |
| [testing.md](testing.md) | 测试策略与浏览器验收清单 |
| [risks.md](risks.md) | 已知风险与缓解措施 |
| [boundaries.md](boundaries.md) | 扩展边界：什么好做 / 什么要改造 / 什么不做 |

## 快速事实

- **技术栈**：Astro 7（`output: 'static'`，纯静态）、Node 22.22.0（`.node-version` 固定）、原生 JS（无 React）
- **译本**：WEBP（World English Bible Protestant Edition，公版）
- **数据规模**：88 条经文、8 个主题、76 个章节文件
- **托管**：Cloudflare Workers 静态资源（`wrangler.jsonc`），自定义域名 `randomversegenerator.info`

## 常用命令

```bash
npm run dev            # 本地开发
npm run build          # 构建静态产物到 dist/
npm run preview        # 预览构建产物
npm run data:build     # 重跑数据管线（verse-selections → verses.json + 章节文件）
npm run data:validate  # 数据质量校验
npm run og:image       # 重新生成社交分享图 public/og-image.png
npm run deploy         # 构建 + 部署到 Cloudflare
```
