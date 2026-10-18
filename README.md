# alsl521 的博客

基于 [Astro 7](https://astro.build/) 的中文个人博客，主题为 [Firefly](https://github.com/CuteLeaf/Firefly)（MIT，基于 Fuwari 演进）。托管在 GitHub Pages 项目页：<https://alsl521.github.io/blog/>。

## 技术栈

- Astro 7（静态站点生成）+ TypeScript
- Vue 3（搜索等交互组件）+ Tailwind CSS 4
- Pagefind（静态站内搜索）
- GitHub Actions + GitHub Pages（推送自动部署）

## 本地开发

要求：Node.js ≥ 22.23、pnpm 11。

```bash
pnpm install
pnpm dev        # http://localhost:4321/blog/
```

> 本站配置了 `base: "/blog"`，本地地址也带 `/blog/` 前缀。

常用命令：

| 命令              | 作用                                      |
| ----------------- | ----------------------------------------- |
| `pnpm dev`        | 启动开发服务器                            |
| `pnpm build`      | 构建静态站点（含图片优化、搜索索引、OG）  |
| `pnpm preview`    | 预览构建产物                              |
| `pnpm run check`  | Astro + Vue + TypeScript 类型检查         |
| `pnpm new-post`   | 用脚本新建一篇文章（可选）                |

## 写文章

在 `src/content/posts/` 下新建 `.md` 或 `.mdx`，文件名即 URL：

```text
src/content/posts/hello-world.md  ->  /blog/posts/hello-world/
```

frontmatter 示例：

```yaml
---
title: "文章标题"
published: 2026-10-17T20:00:00+08:00
description: "文章摘要，用于列表与 SEO"
tags: ["随笔", "Astro"]
category: "生活随笔"
pinned: false
draft: false
image: "./images/cover.png" # 可选：封面图
author: "alsl521"
lang: "zh_CN"
comment: false
---
```

| 字段          | 必填 | 说明                                         |
| ------------- | ---- | -------------------------------------------- |
| `title`       | 是   | 标题                                         |
| `published`   | 是   | 发布时间（ISO 8601，带时区）                 |
| `description` | 否   | 摘要                                         |
| `tags`        | 否   | 标签数组                                     |
| `category`    | 否   | 分类名（会出现在分类导航与归档页）           |
| `draft`       | 否   | `true` 时生产构建不输出                      |
| `pinned`      | 否   | `true` 时列表置顶                            |
| `image`       | 否   | 封面图：相对文章的图片路径，或远程 URL       |
| `comment`     | 否   | 是否允许评论（当前未启用评论系统）           |

### 图片

- **正文图片**：放在文章附近（如 `src/content/posts/images/demo.png`），用相对路径引用：
  `![说明](./images/demo.png)`；也可以直接使用远程图片 URL。相对图片会被自动优化并正确带上 `/blog/` 前缀。
- **封面图**：`image: "./images/cover.png"` 或远程 URL。
- **不要**在 Markdown 里用 `public/` 根路径（如 `![x](/images/x.png)`）——项目页部署时会缺 `/blog/` 前缀；需要放 `public/` 的图片请写成完整站内路径并自行确认线上地址。

## 站点配置

配置集中在 `src/config/`：

- `siteConfig.ts`：站点标题、描述、URL、主题色（`themeColor.hue`）、运行天数、页面开关（`pages`）
- `profileConfig.ts`：头像、昵称、签名、社交链接
- `navBarConfig.ts`：导航栏菜单
- `backgroundWallpaper.ts`：首页壁纸与横幅文字
- `sidebarConfig.ts`：左右侧边栏组件（当前已精简为个人信息、公告、分类、标签、站点统计/信息、日历、目录）
- `commentConfig.ts`：评论系统（默认 `none`，未启用）
- `friendsConfig.ts` 等：对应页面已按精简版关闭

当前已关闭的模块：友链、留言墙、动态、项目、相册、书签导航、追番、打赏、音乐播放器、看板娘；如需启用可改 `siteConfig.pages` 与对应配置。

## 目录结构

```text
src/content/posts/       文章
src/content/spec/about.md 关于页内容
src/config/              站点/个人/导航/侧边栏等配置
src/components/          组件（Vue + Astro）
src/layouts/             页面布局
src/pages/               路由（首页/文章/归档/分类/标签/搜索/RSS/OG/404）
src/styles/              全局样式
scripts/                 构建辅助脚本（图片、字体子集、搜索索引等）
```

## 部署到 GitHub Pages

1. 仓库 `Settings → Pages → Build and deployment → Source` 选择 **GitHub Actions**。
2. 推送到 `main` 即自动构建并发布（见 `.github/workflows/deploy.yml`）：

```bash
git add -A
git commit -m "content: add new post"
git push
```

工作流通过环境变量指定部署路径：

```yaml
env:
  SITE_URL: https://alsl521.github.io
  SITE_BASE: /blog
```

若改用用户主页仓库 `alsl521.github.io` 或自定义域名：把 `SITE_BASE` 改为 `/`，同时修改 `src/config/siteConfig.ts` 的 `site_url` 与 `astro.config.mjs` 的 `base`。

## 旧文迁移

2026-10 已把旧 Hexo 博客（私有仓库 lsl521/HEXO）的 **64 篇**文章迁入本站（当前共 67 篇），按 src/content/posts/<年>/<月>/<日>/ 保存，正文图片使用与新文章相同的相对路径，构建时由 Astro 优化；少量旧文 HTML <img> 图片放在 public/posts-assets/。详见 docs/hexo-migration-2026-10-18.md。

## 许可与致谢

- 主题：[Firefly](https://github.com/CuteLeaf/Firefly)（MIT，Copyright © 2024 saicaca / 2025 CuteLeaf），基于 [Fuwari](https://github.com/saicaca/fuwari) 演进；主题素材与字体的授权说明见上游仓库。
- 本站文章内容：alsl521。
