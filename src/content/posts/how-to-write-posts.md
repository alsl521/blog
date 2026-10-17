---
title: "如何写一篇文章"
author: "alsl521"
pubDatetime: 2026-10-16T10:00:00+08:00
draft: false
tags: ["教程", "Astro"]
description: "介绍本站文章的文件位置、frontmatter 字段、目录、代码块与草稿用法。"
---

这篇文章说明如何在本博客新增一篇文章。

## 目录

## 文件位置

在 `src/content/posts/` 下新建 `.md` 或 `.mdx` 文件，文件名就是文章 URL 的最后一段：

```text
src/content/posts/hello-world.md  ->  /blog/posts/hello-world/
```

子目录会进入 URL，例如 `src/content/posts/tools/vite.md` 对应 `/blog/posts/tools/vite/`。

## frontmatter 字段

| 字段          | 必填 | 说明                                                                                |
| ------------- | ---- | ----------------------------------------------------------------------------------- |
| `title`       | 是   | 文章标题                                                                            |
| `description` | 是   | 摘要，用于列表与 SEO                                                                |
| `pubDatetime` | 是   | 发布时间（ISO 8601，带时区）                                                        |
| `modDatetime` | 否   | 更新时间                                                                            |
| `tags`        | 否   | 标签数组，默认 `["others"]`                                                         |
| `draft`       | 否   | `true` 时生产构建不展示                                                             |
| `featured`    | 否   | `true` 时出现在首页精选                                                             |
| `ogImage`     | 否   | 分享图：远程 URL，或相对文章文件、真实存在于 `src/` 的图片（不支持 `public/` 路径） |

## 目录的用法

在正文中写一个单独的 `## 目录` 标题（下方不要跟其他段落），构建时会自动在该标题下生成可折叠的目录。

## 代码高亮

代码块使用 Shiki 高亮，支持 diff、行高亮等标记。

```ts
const greeting: string = "你好，世界";
console.log(greeting);
```

## 图片

推荐把图片放到 `src/assets/images/`，在正文中用相对路径引用（Astro 会自动优化并处理 base）：

```md
![示例图片](../../assets/images/example.png)
```

## 草稿

在 frontmatter 写 `draft: true`，生产构建不会输出该文章，本地开发仍可预览。
