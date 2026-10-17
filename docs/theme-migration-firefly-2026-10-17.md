# 主题迁移记录：AstroPaper → Firefly（2026-10-17）

## 背景

站点最初基于 AstroPaper main 快照构建并上线（`https://alsl521.github.io/blog/`）。用户希望换成更流行的二次元卡片风主题，最终选择 **Firefly**（`CuteLeaf/Firefly`，MIT，Astro 7 + Vue 3 + Tailwind CSS 4）。

选择 Firefly 的原因：Astro 7 原生、中文 UI/文档原生、MIT 许可可合法修改与公开部署、2.3k+ stars 且维护活跃、功能的成熟度高于同类新主题（Kanade 无 LICENSE，不能直接用于公开仓库）。

## 迁移内容

- 主题基座：Firefly（从 GitHub 获取源码，保留 MIT LICENSE；主题自带 README/演示内容已移除）
- 内容迁移：3 篇文章 + 关于页（frontmatter 改为 Firefly schema：`published`/`category`/`pinned` 等；正文去掉 AstroPaper 特有的手写 `## 目录`，目录由主题自动生成）
- 中文化：主题原生 zh_CN；站点名/作者/描述/导航/公告/个人卡片已改为本站信息
- 精简版范围：关闭友链、留言墙、动态、项目、相册、书签导航、追番、打赏、音乐播放器、看板娘；保留首页、文章、归档、分类、标签、关于、搜索、RSS/Atom、404
- base 路径修复（`/blog/` 项目页）：
  - `astro.config.mjs` 设置 `base: "/blog"`
  - `robots.txt` 的 Sitemap 补 base
  - 文章 OG 图 URL 补 base（`Layout.astro` 使用 `url()`）
  - Pagefind 搜索：`pagefind.options({ baseUrl })` 传入 base，避免 `/blog/blog/...`
  - Profile/Banner/Announcement/RSS/Atom 页内链统一走 `url()`
  - sitemap 过滤逻辑先剥离 base 再匹配页面开关
  - `schema-image.ts` 避免构建后已带 base 的图片 URL 再次拼接
- 清理：删除被关闭页面路由与对应演示内容、未使用的 `public/pio`（14.9MB）、`public/gallery`、本地音乐；public 体积约 0.5MB
- 部署：`.github/workflows/deploy.yml` 使用 `SITE_URL`/`SITE_BASE` 环境变量构建并发布到 GitHub Pages

## 验证结果

- `pnpm build`：exit 0（12 个 HTML 页面，Pagefind 索引 4 页，zh-cn）
- 预览冒烟：`/blog/`、文章、归档、分类、标签、关于、搜索、RSS/Atom、sitemap、robots、OG、pagefind.js 均 200；未知路径与已关闭页面 404
- 浏览器 E2E（headless Chrome）：站内链接全部以 `/blog/` 开头（0 条缺失）；Markdown 相对图片渲染为 `/blog/_astro/...` 且加载成功；搜索接口返回 `/blog/posts/...`（无双 base）；移动端 390px 无横向溢出；无 console 错误
- 线上部署：待推送 `main` 后由 GitHub Actions 完成

## 遗留/可选项

- 评论系统未启用（Firefly 支持 twikoo/waline/giscus/disqus/artalk）
- 若换根路径部署，需要同时改 `SITE_BASE`、`siteConfig.site_url` 与 `astro.config.mjs` 的 `base`
