# 旧 Hexo 博客内容迁移记录（2026-10-18）

## 来源

- 仓库：`alsl521/HEXO`（私有，`source/_posts`）
- 文章：**64 篇**，时间范围 2023-12-08 ~ 2025-06-05，按 `年/月/日/<文件名>.md + 同名资源目录` 组织
- 图片：原仓库 `source/_posts` 下共 2098 张图片（268.5MB），其中被引用 2069 张
- 迁移后本站共 **67 篇文章**（保留原先 3 篇）

## 迁移规则

- 文章放在 `src/content/posts/<年>/<月>/<日>/<文件名>.md`，URL 形如
  `/blog/posts/2023/12/08/cplusplus01/`（Firefly 会对 content id 做小写化）
- frontmatter 转换：Hexo `date` → `published`（补 `+08:00`）；`updated` 保留；`categories` 归并为 Firefly 单分类；`tags` 去重并补全被归并掉的子分类；统一 `draft: false / pinned: false / author: alsl521 / lang: zh_CN / comment: false`
- 分类整理（Firefly 单分类）：
  | 分类 | 篇数 |
  | --- | --- |
  | Java | 26 |
  | C#/.NET | 17 |
  | 前端 | 13 |
  | C++ | 4 |
  | 工具 | 2 |
  | 机器学习 | 1 |
  | 计算机基础 | 1 |
- 正文图片：保持与新文章一致的相对路径写法（`./<文章目录>/<图片>.webp`），由 Astro 构建时自动优化；PNG/JPG 预压缩为 WebP q82（268.5MB → 97.6MB），GIF 保留原图动画
- 旧文中内嵌的 HTML `<img>`（151 张）保留原标签，图片放在 `public/posts-assets/`，`src` 重写为 `/blog/posts-assets/...` 绝对路径
- 原仓库中指向旧路径（`HEXO-1/...`、`../images/...`）且已不存在的图片：替换为 `*(原图缺失)*` 文字（共 30 处）
- 外链图片（4 处）保持原 URL
- 旧 Hexo 的根路径 URL（`https://alsl521.github.io/2023/...`）无法在项目页 `/blog/` 下保留，未生成重定向

## 验证

- `pnpm run build`：exit 0；67 个文章页、67 张 OG 图、RSS 67 条、sitemap 81 条
- 构建产物约 165MB（图片经 Astro 生成 WebP 变体）；Pagefind 搜索可用
- 预览冒烟：首页/分页/归档/分类/标签/搜索/RSS/OG/迁移文章均 200
- 浏览器 E2E：首页无缺失 base 链接；图片文章 390 张图片 URL 可访问；HTML 内嵌图片正常；缺失图片提示正常；搜索返回 `/blog/posts/...`（无双 base）；移动端无横向溢出；无 console 错误

## 注意事项

- 迁移内容的图片位于 `src/content/posts/` 与 `public/posts-assets/`，仓库体积增加约 105MB
- 以后新增文章仍按 README 的相对图片方式即可；旧文中的 HTML `<img>` 使用 public 绝对路径，换域名/根路径部署时需同步调整
