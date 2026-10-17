---
title: "把博客部署到 GitHub Pages"
author: "alsl521"
pubDatetime: 2026-10-15T09:00:00+08:00
draft: false
tags: ["教程", "GitHub"]
description: "本站的部署流程：仓库、GitHub Actions、Pages 设置，以及 base 路径常见问题。"
---

本文记录本博客从本地到 GitHub Pages 的部署步骤。

## 目录

## 一次性设置

1. 在 GitHub 新建**公开**仓库 `blog`（不要勾选初始化 README）。
2. 打开仓库 `Settings -> Pages`，把 `Build and deployment` 的 Source 设为 **GitHub Actions**。
3. 本地关联远程仓库并推送：

```bash
git remote add origin https://github.com/alsl521/blog.git
git push -u origin main
```

## 自动部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动安装依赖、构建并发布。构建流程包含：类型检查、Astro 构建、Pagefind 索引生成、上传 artifact。

## 为什么 URL 带 /blog/

这是 GitHub Pages **项目页**（`https://alsl521.github.io/blog/`）的部署方式。站点配置里：

```ts
site: { url: "https://alsl521.github.io", basePath: "/blog" };
```

所有站内链接、RSS、sitemap、搜索索引都会带上 `/blog/` 前缀。若以后改用用户主页仓库 `alsl521.github.io`，只需把 `basePath` 删除。

## 常见问题

- **页面 404**：先确认仓库 Settings → Pages 的 Source 是否为 GitHub Actions，再检查 `basePath` 与实际仓库名的对应关系。
- **搜索没结果**：确认构建日志里有 `Pagefind: 已索引 N 个页面`，且 `dist/pagefind/` 已上传。
- **样式丢失**：检查浏览器 Network 中 `_astro/` 资源是否返回 200，通常是 base 配置不一致导致。

## 本地构建预览

```bash
pnpm install
pnpm build
pnpm preview
```
