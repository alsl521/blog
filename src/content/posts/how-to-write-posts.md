---
title: "如何写一篇文章"
published: 2026-10-16T10:00:00+08:00
description: "介绍本站文章的文件位置、frontmatter 字段、目录、代码块、图片与草稿用法。"
tags: ["教程", "Astro"]
category: "开发笔记"
pinned: false
draft: false
author: "alsl521"
lang: "zh_CN"
comment: false
---

这篇文章说明如何在本博客新增一篇文章。

![Markdown 图片示例](./images/demo.png)

## 文件位置

在 `src/content/posts/` 下新建 `.md` 或 `.mdx` 文件，文件名就是文章 URL 的最后一段：

```text
src/content/posts/hello-world.md  ->  /blog/posts/hello-world/
```

子目录会进入 URL，例如 `src/content/posts/tools/vite.md` 对应 `/blog/posts/tools/vite/`。

## frontmatter 字段

| 字段          | 必填 | 说明                                       |
| ------------- | ---- | ------------------------------------------ |
| `title`       | 是   | 文章标题                                   |
| `published`   | 是   | 发布时间（ISO 8601，带时区）               |
| `description` | 否   | 摘要，用于列表与 SEO                       |
| `tags`        | 否   | 标签数组                                   |
| `category`    | 否   | 分类名，例如「开发笔记」                   |
| `draft`       | 否   | `true` 时生产构建不输出                    |
| `pinned`      | 否   | `true` 时在列表中置顶                      |
| `image`       | 否   | 封面图：相对文章文件的图片路径，或远程 URL |
| `comment`     | 否   | 是否允许评论（本站暂未启用评论系统）       |

## 目录

文章侧边的目录由主题根据正文标题自动生成，不需要手动写目录。

## 代码高亮

代码块使用 Expressive Code 高亮，支持复制、行号等能力。

```ts
const greeting: string = "你好，世界";
console.log(greeting);
```

## 图片

正文图片支持两种写法（都会正常显示并自动带上 `/blog/` 前缀）：

```md
![本地图片](./images/demo.png)
![远程图片](https://example.com/image.png)
```

推荐把图片放在文章同目录或 `src/` 下，用相对路径引用；**不要**使用 `public/` 根路径（`/images/...`），项目页部署时会缺 `/blog/` 前缀。

## 草稿

在 frontmatter 写 `draft: true`，生产构建不会输出该文章，本地开发仍可预览。
