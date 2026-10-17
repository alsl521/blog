# alsl521 的博客

基于 [Astro](https://astro.build/) 的中文个人博客，主题基座为 [AstroPaper](https://github.com/satnaing/astro-paper)（main 快照 `35cfa7f`，MIT）。托管在 GitHub Pages 项目页：<https://alsl521.github.io/blog/>。

## 技术栈

- Astro 7（静态站点生成）+ TypeScript
- Tailwind CSS 4
- Pagefind（静态站内搜索）
- GitHub Actions + GitHub Pages（推送自动部署）

## 本地开发

要求：Node.js ≥ 22.22、pnpm 11。

```bash
pnpm install
pnpm dev        # http://localhost:4321/blog/
```

> 本站配置了 `base: "/blog"`，所以本地地址以 `/blog/` 开头。

常用命令：

| 命令              | 作用                                                 |
| ----------------- | ---------------------------------------------------- |
| `pnpm dev`        | 启动开发服务器                                       |
| `pnpm build`      | 类型检查 + 构建 + 生成 Pagefind 搜索索引             |
| `pnpm preview`    | 预览构建产物                                         |
| `pnpm check`      | 仅做类型检查（`astro check`）                        |
| `pnpm check:site` | 构建后自检（base/RSS/sitemap/404/搜索索引/中文 TOC） |
| `pnpm format`     | 用 Prettier 格式化                                   |
| `pnpm lint`       | ESLint 检查                                          |

## 写新文章

在 `src/content/posts/` 下新建 `.md` 文件，文件名即 URL：`src/content/posts/my-post.md` → `/blog/posts/my-post/`。

frontmatter 示例：

```yaml
---
title: "文章标题"
description: "文章摘要，用于列表与 SEO"
pubDatetime: 2026-10-17T20:00:00+08:00
tags: ["随笔", "Astro"]
draft: false
featured: false
---
```

| 字段          | 必填 | 说明                                                                                |
| ------------- | ---- | ----------------------------------------------------------------------------------- |
| `title`       | 是   | 标题                                                                                |
| `description` | 是   | 摘要                                                                                |
| `pubDatetime` | 是   | 发布时间（带时区）                                                                  |
| `modDatetime` | 否   | 更新时间                                                                            |
| `tags`        | 否   | 标签数组                                                                            |
| `draft`       | 否   | `true` 时生产不输出、开发可预览                                                     |
| `featured`    | 否   | `true` 时进入首页精选                                                               |
| `ogImage`     | 否   | 分享图：远程 URL，或相对文章文件、真实存在于 `src/` 的图片（不支持 `public/` 路径） |

其他约定：

- 正文先写引导段落，再单独写一行 `## 目录`（目录标题下不要跟其他段落），构建时会自动生成可折叠目录。
- 图片推荐放 `src/assets/images/`，在正文用相对路径引用，构建时会自动优化并带上 `/blog/` 前缀。
- 中文标签直接写中文即可（例：`tags: ["随笔", "Astro"]`），URL 会自动编码。

## 站点配置

所有站点信息集中在 `astro-paper.config.ts`：

- `site.url`：站点域名（GitHub Pages 用户域名）
- `site.basePath`：部署子路径；本项目为 `/blog`。若改用用户主页仓库 `alsl521.github.io`，删除该字段
- `site.title / description / author / socials`：标题、描述、作者、社交链接
- `features.dynamicOgImage`：已关闭（中文动态 OG 图需要 CJK 字体），使用 `public/default-og.jpg`（1200×630，可直接替换为你的分享图）
- `features.search`：`pagefind` 站内搜索

## 目录结构

```text
src/content/posts/       文章（Markdown/MDX）
src/content/pages/       独立页面（about）
src/i18n/lang/           UI 文案（zh-CN.ts，en.ts 回退）
src/layouts/             页面布局
src/pages/               路由（首页/列表/详情/标签/归档/关于/搜索/RSS/404）
src/styles/              全局样式与主题变量
astro-paper.config.ts    站点配置
astro.config.ts          Astro 配置（base/i18n/Markdown/Shiki）
scripts/                 构建辅助脚本（Pagefind 索引/自检/兜底）
```

## 部署到 GitHub Pages

1. 在 GitHub 新建**公开**仓库 `blog`（不要初始化 README）。
2. 仓库 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**。
3. 本地推送：

```bash
git remote add origin https://github.com/alsl521/blog.git
git push -u origin main
```

推送后 `.github/workflows/deploy.yml` 自动构建并发布，几分钟后访问 <https://alsl521.github.io/blog/>。

## 自定义域名（可选）

1. 在仓库 `Settings → Pages → Custom domain` 设置域名（GitHub 不会仅凭 `CNAME` 文件自动生效）。
2. 修改 `astro-paper.config.ts`：`site.url` 改为自定义域名，删除 `basePath`。
3. 按需添加 `public/CNAME`（内容为域名）。

## 评论（可选，Giscus）

如需评论，按 <https://giscus.app/> 的指引：安装 Giscus App、开启仓库 Discussions、把生成的 `<script>` 片段放进 `src/pages/posts/[...slug]/index.astro` 的评论区位置（或新建 `src/components/Comments.astro` 引入）。本项目默认不启用，保持纯静态与零第三方脚本。

## 常见问题

- **线上 404**：确认 Pages Source 是 GitHub Actions，并检查 `site.basePath` 是否与实际仓库名一致。
- **搜索没有结果**：确认构建日志有 `Pagefind: 已索引 N 个页面`；开发环境需先 `pnpm build` 才有搜索索引。
- **样式或图片 404**：运行 `pnpm check:site`，检查是否所有站内 URL 都带 `/blog/`。
- **`pnpm install` 后 Pagefind 报找不到平台二进制**：本机网络可能拉取大文件超时。`pnpm build` 会先运行 `scripts/ensure-pagefind-binary.mjs` 自动补装；也可手动执行该脚本。

## 许可证

MIT，基于 AstroPaper（Copyright © 2023 Sat Naing）定制。详见 `LICENSE`。
