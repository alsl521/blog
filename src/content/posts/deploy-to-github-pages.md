---
title: "把博客部署到 GitHub Pages"
published: 2026-10-15T09:00:00+08:00
description: "本站的部署流程：仓库、GitHub Actions、Pages 设置，以及 base 路径常见问题。"
tags: ["教程", "GitHub"]
category: "开发笔记"
pinned: false
draft: false
author: "alsl521"
lang: "zh_CN"
comment: false
---

本文记录本博客从本地到 GitHub Pages 的部署步骤。

## 一次性设置

1. 在 GitHub 新建**公开**仓库 `blog`（不要勾选初始化 README）。
2. 打开仓库 `Settings -> Pages`，把 `Build and deployment` 的 Source 设为 **GitHub Actions**。
3. 本地关联远程仓库并推送：

```bash
git remote add origin https://github.com/alsl521/blog.git
git push -u origin main
```

## 自动部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动安装依赖、构建并发布。构建时通过环境变量指定站点地址与子路径：

```yaml
env:
  SITE_URL: https://alsl521.github.io
  SITE_BASE: /blog
```

## 为什么 URL 带 /blog/

这是 GitHub Pages **项目页**（`https://alsl521.github.io/blog/`）的部署方式。站内链接、RSS、sitemap、搜索索引都会带上 `/blog/` 前缀。若以后改用用户主页仓库 `alsl521.github.io`，把工作流里的 `SITE_BASE` 改为 `/` 即可。

## 常见问题

- **页面 404**：先确认仓库 Settings → Pages 的 Source 是否为 GitHub Actions，再检查 `SITE_BASE` 与实际仓库名的对应关系。
- **搜索没结果**：确认构建日志里有 Pagefind 索引生成，且 `dist/pagefind/` 已随站点上传。
- **样式丢失**：检查浏览器 Network 中 `_astro/` 资源是否返回 200，通常是 base 配置不一致导致。

## 本地构建预览

```bash
pnpm install
pnpm build
pnpm preview
```
