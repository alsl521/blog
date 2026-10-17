# 基于 Astro 的 GitHub 中文博客 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在仓库根目录交付一个以 AstroPaper main 快照为基座的中文个人博客，部署到 GitHub Pages 项目页 `https://alsl521.github.io/blog/`，push 后自动构建发布。

**Architecture:** 纯静态 Astro SSG 单仓库：Markdown 内容集合 → Astro 预渲染 `dist/` → Pagefind 生成静态搜索索引 → GitHub Actions 上传 artifact 并由 `actions/deploy-pages` 发布。所有站内 URL 经主题的 `withBase`/`getAssetPath`/`getRelativeLocaleUrl` 前缀 `/blog`；搜索索引在构建时通过 Node 脚本以 `/blog` 为根重新生成，避免项目页下搜索结果 404。

**Tech Stack:** Astro 7.0.3（lockfile 固定）、AstroPaper main @ `35cfa7f`、TypeScript 6.0.3、Tailwind CSS 4、Pagefind 1.5.2、pnpm 11.22、Node 24（CI）、GitHub Actions Pages。

**Spec:** `docs/superpowers/specs/2026-10-17-astro-github-blog-design.md`（执行前必读；本计划的每一步都从该规格推导）

## Global Constraints

- Node ≥ 22.22（本机 v24.14.1）、pnpm 11.22、git 2.53；Windows + PowerShell 为主要执行环境，CI 为 Ubuntu。
- **禁止** `pnpm up` / `pnpm upgrade` / 手动改 lockfile；`pnpm-lock.yaml` 必须保持主题快照原样（astro 7.0.3、typescript 6.0.3 等）。
- 站点常量：`site = https://alsl521.github.io`，`base = /blog`，标题「alsl521 的博客」，作者 `alsl521`，描述「记录学习与思考」，语言 `zh-CN`，时区 `Asia/Shanghai`。
- 所有站内链接/资源必须以 `/blog/` 开头；RSS/sitemap/搜索索引里的 URL 同样必须带 `/blog/`。
- 不新增运行时依赖；`scripts/` 只允许 Node 内置模块与已安装的 `pagefind`。不引入评论/自定义域名/双语。
- 保留主题 `LICENSE`（MIT，Copyright © 2023 Sat Naing）与 README 中的上游署名。
- 每个任务结束必须通过 `pnpm build`（Windows 下）；涉及源码改动的任务额外跑 `pnpm check`。
- 提交信息使用 Conventional Commits（`chore:` / `feat:` / `fix:` / `docs:` / `content:`），每任务一次提交。
- Prettier 配置：`endOfLine: lf`、`printWidth: 80`、双引号、`arrowParens: avoid`；ESLint 全局 `no-console: error`（因此 `scripts/**` 必须加入 eslint ignores）。

## Review Focus

1. **base 路径遗漏**：任一页面内链/资源/RSS/sitemap 缺少 `/blog/` → 线上 404。`scripts/check-site.mjs` 必须逐 HTML 扫描。
2. **搜索索引 URL 缺 base**：Pagefind 按 `dist/` 文件路径生成结果 URL（`/posts/x/`），项目页下点击 404。构建脚本必须把站点内容放进带 base 的临时根目录再索引。
3. **RSS autodiscovery 尾斜杠**：主题原代码生成 `/blog/rss.xml/`，端点带扩展名时 404。
4. **中文标题的动态 OG**：Satori + Google Sans Code 无 CJK 字形 → 必须关闭动态 OG 并删除 `src/pages/og.png.ts` 路由，否则构建/产物异常。
5. **Windows 构建脚本**：主题 `cp -r` 在 cmd 下必失败，必须改为 Node 脚本（`copy-pagefind.mjs`）。
6. **额外 404/空白**：`public/favicon.ico` 不存在、dev 模式 `public/pagefind` 缺失导致搜索空白。
7. **中文检索质量**：Pagefind 平台包优先使用 `pagefind_extended`（含 CJK 分词）；构建后检查 `pagefind-entry.json` 的 languages，必要时用 `forceLanguage: "zh"` 并重跑。

## 文件结构（本计划落点）

| 路径 | 动作 | 职责 |
| --- | --- | --- |
| 仓库根（主题快照） | 新增 | AstroPaper main @ `35cfa7f` 全部文件（保留 lockfile/LICENSE/CI） |
| `astro-paper.config.ts` | 修改 | 站点信息、basePath、功能开关、社交/分享 |
| `astro.config.ts` | 修改 | site/base、i18n(zh-CN)、Markdown 处理器与目录标题、Shiki、fonts |
| `src/types/config.ts` | 修改 | `SiteConfig.basePath?: string` |
| `src/i18n/lang/zh-CN.ts` | 新增 | 47 个 UIStrings 中文翻译 |
| `src/components/Datetime.astro` | 修改 | dayjs zh-cn + `YYYY年M月D日` |
| `src/components/Breadcrumb.astro` | 修改 | 中文分页面包屑（「第 N 页」） |
| `src/styles/theme.css` | 修改 | `--font-app` 中文字体栈 |
| `src/pages/index.astro` | 修改 | 首页中文 hero 文案 |
| `src/layouts/Layout.astro` | 修改 | RSS autodiscovery 改 `getAssetPath`、删除 favicon.ico 引用 |
| `src/pages/rss.xml.ts` | 修改 | item link 保证带 base |
| `src/pages/og.png.ts` | 删除 | 动态 OG 关闭后的死路由 |
| `src/content/posts/*.md` | 替换 | 3 篇中文示例文章 |
| `src/content/pages/about.md` | 替换 | 中文关于页 |
| `public/default-og.jpg` | 替换 | 1200×630 中文静态 OG 图 |
| `scripts/build-search-index.mjs` | 新增 | 带 base 根目录的 Pagefind 索引生成 |
| `scripts/copy-pagefind.mjs` | 新增 | 跨平台复制索引到 `public/pagefind/`（dev 搜索用） |
| `scripts/check-site.mjs` | 新增 | dist 静态自检（base/RSS/sitemap/404/索引） |
| `.github/workflows/deploy.yml` | 新增 | GitHub Pages 部署 |
| `.github/workflows/ci.yml` | 修改 | pnpm 版本与 `packageManager` 对齐 |
| `README.md` | 重写 | 中文使用与部署说明 |
| `.gitignore` / `.prettierignore` / `eslint.config.js` / `package.json` | 修改 | 构建脚本、忽略规则、包管理版本 |

---

## Task 1: 导入 AstroPaper 快照并打通跨平台构建管线

**Files:**
- Create: `scripts/copy-pagefind.mjs`、`scripts/build-search-index.mjs`
- Modify: `package.json`、`eslint.config.js`、`.gitignore`、`.prettierignore`
- Import: 主题快照全部文件（保留 `pnpm-lock.yaml`、`LICENSE`、`.github/workflows/ci.yml`）

**Interfaces:**
- Consumes: 无（起点）。
- Produces: `pnpm build` = `astro check && astro build && node scripts/build-search-index.mjs && node scripts/copy-pagefind.mjs`；产物 `dist/`、`dist/pagefind/`、`public/pagefind/`；脚本读取环境变量 `BASE_PATH`（默认 `/blog`）。

- [ ] **Step 1: 获取固定 commit 的 AstroPaper 快照**

```powershell
$src = Join-Path $env:TEMP 'astropaper-src'
if (Test-Path $src) { Remove-Item -Recurse -Force $src }
git clone https://github.com/satnaing/astro-paper.git $src
git -C $src checkout 35cfa7fbe0b897306d27670d3819e55d5205f3dd
git -C $src log -1 --oneline
```

Expected: 输出 `35cfa7f fix: move focus to main content when skip-to-content is clicked (#665)`。

- [ ] **Step 2: 复制到仓库根（保留 `.git`、`docs/`、`.research/`）**

```powershell
$src = Join-Path $env:TEMP 'astropaper-src'
robocopy $src . /E /XD .git /NFL /NDL /NJH /NJS /NP
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }
Get-ChildItem -Force | Select-Object Name
```

Expected: 出现 `astro.config.ts`、`astro-paper.config.ts`、`pnpm-lock.yaml`、`src/`、`.github/` 等；`git status --short` 显示大量未跟踪文件，`docs/` 与 `.research/` 不受影响。

- [ ] **Step 3: 删除与本博客无关的主题附带文件**

```powershell
Remove-Item Dockerfile, compose.yaml, .dockerignore, cz.yaml, AstroPaper-lighthouse-score.svg, CHANGELOG.md -Force -ErrorAction SilentlyContinue
```

- [ ] **Step 4: 追加忽略规则**

```powershell
Add-Content .gitignore "`n# local research notes and scratch`n.research/`n.pagefind-site/`n"
Add-Content .prettierignore "`n# generated by Pagefind`n/public/pagefind`n"
Get-Content .gitignore | Select-Object -Last 6
```

Expected: `.gitignore` 末尾包含 `.research/`、`.pagefind-site/`；`.prettierignore` 包含 `/public/pagefind`。

- [ ] **Step 5: 更新 `package.json`（脚本 + 包管理器 + engines）**

把 `scripts`、`engines`、`packageManager` 改成：

```json
{
  "engines": { "node": ">=22.22.0" },
  "packageManager": "pnpm@11.22.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build && node scripts/build-search-index.mjs && node scripts/copy-pagefind.mjs",
    "preview": "astro preview",
    "sync": "astro sync",
    "astro": "astro",
    "check": "astro check",
    "check:site": "node scripts/check-site.mjs",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "lint": "eslint ."
  }
}
```

（`check:site` 的脚本文件在 Task 6 创建；在此之前该命令不可用，`pnpm build` 不依赖它。）

- [ ] **Step 6: 让 ESLint 忽略脚本与临时目录**

把 `eslint.config.js` 最后一个对象的 `ignores` 改为：

```js
{ ignores: ["dist/**", ".astro/**", "public/pagefind/**", "scripts/**", ".pagefind-site/**"] },
```

- [ ] **Step 7: 创建 `scripts/copy-pagefind.mjs`**

```js
import fs from "node:fs";
import path from "node:path";

const source = path.join("dist", "pagefind");
const target = path.join("public", "pagefind");

if (!fs.existsSync(source)) {
  console.warn("dist/pagefind 不存在，跳过复制（请先运行 pnpm build 的索引步骤）");
} else {
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
  console.log("Pagefind: 索引已复制到 public/pagefind（供 pnpm dev 搜索使用）");
}
```

- [ ] **Step 8: 创建 `scripts/build-search-index.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import * as pagefind from "pagefind";

const siteDir = "dist";
const basePath = (process.env.BASE_PATH || "/blog").replace(/\/+$/, "");
const baseFolder = basePath.replace(/^\//, "");
const stagingDir = ".pagefind-site";
const outputDir = path.join(siteDir, "pagefind");

if (!fs.existsSync(path.join(siteDir, "index.html"))) {
  throw new Error("dist/index.html 不存在，请先运行 astro build");
}

fs.rmSync(stagingDir, { recursive: true, force: true });
fs.mkdirSync(stagingDir, { recursive: true });

// dist 是按站点根输出的（不含 base 目录），Pagefind 会按文件路径生成结果 URL。
// 为了让搜索结果 URL 带上 /blog/ 前缀，把站点内容放到 staging/<base>/ 下再索引。
let indexPath = siteDir;
if (!fs.existsSync(path.join(siteDir, baseFolder))) {
  fs.cpSync(siteDir, path.join(stagingDir, baseFolder), {
    recursive: true,
    filter: source => !source.split(path.sep).includes("pagefind"),
  });
  indexPath = stagingDir;
}

const { index, errors } = await pagefind.createIndex();
if (errors.length > 0) throw new Error(errors.join("\n"));
if (!index) throw new Error("Pagefind: 无法创建索引");

const added = await index.addDirectory({ path: indexPath });
if (added.errors.length > 0) throw new Error(added.errors.join("\n"));
console.log(`Pagefind: 已索引 ${added.page_count} 个页面（root: ${indexPath}）`);

fs.rmSync(outputDir, { recursive: true, force: true });
const written = await index.writeFiles({ outputPath: outputDir });
if (written.errors.length > 0) throw new Error(written.errors.join("\n"));

await index.deleteIndex();
await pagefind.close();
fs.rmSync(stagingDir, { recursive: true, force: true });
console.log(`Pagefind: 索引已写入 ${outputDir}`);
```

- [ ] **Step 9: 验证 Pagefind 的 URL 推导规则（确认 base 方案正确）**

```powershell
node -e "import('pagefind').then(async pf => { const { index, errors } = await pf.createIndex(); if (errors.length) throw new Error(errors.join('; ')); const res = await index.addHTMLFile({ sourcePath: 'blog/posts/smoke/index.html', content: '<html lang=\"zh-CN\"><body><h1>冒烟</h1></body></html>' }); console.log('URL:', res.file.url); await index.deleteIndex(); await pf.close(); })"
```

Expected: 输出 `URL: /blog/posts/smoke/`（证明“把内容放进 base 子目录再索引”能让结果 URL 自动带 base）。

- [ ] **Step 10: 安装依赖（锁定 lockfile）**

```powershell
pnpm install --frozen-lockfile
```

Expected: 安装成功，`node_modules/`、`pnpm-lock.yaml` 不变（`git status` 中 lockfile 无改动）。

- [ ] **Step 11: 基线构建（此时仍是英文主题默认内容）**

```powershell
pnpm build
```

Expected: `astro check` 无错误；`astro build` 完成；`Pagefind: 已索引 N 个页面`；`Pagefind: 索引已写入 dist/pagefind`；`public/pagefind` 生成。失败时修脚本问题，不改依赖版本。

- [ ] **Step 12: 验证构建产物**

```powershell
Test-Path dist/index.html, dist/rss.xml, dist/sitemap-index.xml, dist/404.html
Test-Path dist/pagefind/pagefind-entry.json
git status --short | Select-String 'pnpm-lock.yaml'
```

Expected: 全部 `True`；lockfile 无改动输出（空）。

- [ ] **Step 13: 提交**

```powershell
git add -A
git commit -m "chore: import astropaper snapshot with cross-platform build pipeline"
```

---

## Task 2: 站点配置、base 路径、关闭动态 OG、修复 RSS/favicon

**Files:**
- Modify: `astro-paper.config.ts`、`src/types/config.ts`、`astro.config.ts`、`src/layouts/Layout.astro`、`src/pages/rss.xml.ts`
- Delete: `src/pages/og.png.ts`

**Interfaces:**
- Consumes: Task 1 的构建管线（`pnpm build`）与 `dist/` 产物。
- Produces: `config.site.basePath`（`/blog`）、Astro `base`、`i18n.locales = ["zh-CN"]`、Markdown 目录标题 `目录`；`pnpm build` 产物中站内 URL 均带 `/blog/`。

- [ ] **Step 1: 重写 `astro-paper.config.ts`**

```ts
import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://alsl521.github.io",
    basePath: "/blog",
    title: "alsl521 的博客",
    description: "记录学习与思考",
    author: "alsl521",
    profile: "https://github.com/alsl521",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/alsl521/blog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/alsl521" }],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
```

- [ ] **Step 2: `src/types/config.ts` 增加 `basePath`**

在 `SiteConfig` 的 `url` 字段后插入：

```ts
  /** Deploy subpath, e.g. "/blog" for GitHub Pages project sites. Omit for root deployments. */
  basePath?: string;
```

（`ResolvedSiteConfig` 保持不变；`src/config.ts` 通过 `...userConfig.site` 自动透传。）

- [ ] **Step 3: 改写 `astro.config.ts`**

```ts
import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

const basePath = config.site.basePath?.replace(/\/+$/, "");

export default defineConfig({
  site: config.site.url,
  ...(basePath ? { base: basePath } : {}),
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
      serialize(item) {
        const base = config.site.basePath?.replace(/\/+$/, "");
        if (base) {
          const url = new URL(item.url);
          if (!url.pathname.startsWith(`${base}/`) && url.pathname !== base) {
            url.pathname = `${base}${url.pathname}`;
            item.url = url.href;
          }
        }
        return item;
      },
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        [remarkToc, { heading: "目录", maxDepth: 3 }],
        [remarkCollapse, { test: "目录" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
```

- [ ] **Step 4: 修复 `src/layouts/Layout.astro`**

① 删除导入行 `import { getRelativeLocaleUrl } from "astro:i18n";`。
② 把 `rssHref` 改为：

```ts
const rssHref = getAssetPath("rss.xml");
```

③ 删除 `<link rel="icon" href={getAssetPath("favicon.ico")} />` 这一行（`public/` 里只有 `favicon.svg`）。

- [ ] **Step 5: 修复 `src/pages/rss.xml.ts` 的 base 前缀**

在文件顶部增加 base 拼接函数，并把 `link` 改为绝对 URL：

```ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

function toAbsoluteUrl(pathname: string): string {
  const base = config.site.basePath?.replace(/\/+$/, "") ?? "";
  const url = new URL(pathname, config.site.url);
  if (base && !url.pathname.startsWith(`${base}/`)) {
    url.pathname = `${base}${url.pathname}`;
  }
  return url.href;
}

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: toAbsoluteUrl(getPostUrl(id, filePath, config.site.lang)),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
```

- [ ] **Step 6: 删除动态 OG 路由**

```powershell
Remove-Item src/pages/og.png.ts -Force
```

（`src/pages/posts/[...slug]/index.png.ts` 在 `dynamicOgImage: false` 时 `getStaticPaths` 返回空数组，保留无害。）

- [ ] **Step 7: 构建并验证 base 前缀**

```powershell
pnpm build
$html = Get-ChildItem dist -Recurse -Filter *.html
$bad = $html | Select-String -Pattern '(?:href|src)="/(?!/)(?!blog(?:/|"))'
if ($bad) { $bad | Select-Object -First 10; throw "发现未带 base 的站内链接" }
```

Expected: 无输出、无异常（所有站内链接以 `/blog/` 开头）。

- [ ] **Step 8: 验证 RSS、sitemap、canonical、autodiscovery**

```powershell
$rss = Get-Content dist/rss.xml -Raw
if ($rss -match '<link>https://alsl521\.github\.io/(?!blog/)') { throw "RSS link 缺少 base" }
$sitemap = Get-Content dist/sitemap-0.xml -Raw
$locs = [regex]::Matches($sitemap, '<loc>([^<]+)</loc>') | ForEach-Object { $_.Groups[1].Value }
$badLocs = $locs | Where-Object { $_ -notmatch '/blog/' }
if ($badLocs) { $badLocs; throw "sitemap loc 缺少 base" }
Select-String -Path dist/index.html -Pattern 'rel="alternate"[^>]*application/rss\+xml'
Select-String -Path (Get-ChildItem dist/posts/*/index.html | Select-Object -First 1) -Pattern 'rel="canonical"'
```

Expected: RSS/sitemap 无异常；autodiscovery 的 `href` 为 `https://alsl521.github.io/blog/rss.xml`（**无尾斜杠**）；canonical 为 `https://alsl521.github.io/blog/posts/...`。

- [ ] **Step 9: 提交**

```powershell
git add -A
git commit -m "feat: configure chinese site with github pages base path"
```

---

## Task 3: 中文化（i18n、日期、字体、首页、面包屑）

**Files:**
- Create: `src/i18n/lang/zh-CN.ts`
- Modify: `src/components/Datetime.astro`、`src/components/Breadcrumb.astro`、`src/styles/theme.css`、`src/pages/index.astro`

**Interfaces:**
- Consumes: Task 2 的 `i18n.locales = ["zh-CN"]`、`site.lang = "zh-CN"`。
- Produces: `useTranslations("zh-CN")` 返回完整中文 UI；日期格式 `YYYY年M月D日`；中文字体栈。

- [ ] **Step 1: 创建 `src/i18n/lang/zh-CN.ts`**

```ts
import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首页",
    posts: "文章",
    tags: "标签",
    about: "关于",
    archives: "归档",
    search: "搜索",
  },
  post: {
    publishedAt: "发布于",
    updatedAt: "更新于",
    sharePostIntro: "分享这篇文章：",
    sharePostOn: "分享到 {{platform}}",
    sharePostViaEmail: "通过邮件分享这篇文章",
    tagLabel: "标签",
    backToTop: "回到顶部",
    goBack: "返回",
    editPage: "编辑页面",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: "第",
  },
  home: {
    socialLinks: "社交链接",
    featured: "精选",
    recentPosts: "最新文章",
    allPosts: "全部文章",
  },
  footer: {
    copyright: "版权所有",
    allRightsReserved: "保留所有权利。",
  },
  pages: {
    tagTitle: "标签",
    tagDesc: "带有该标签的全部文章",
    tagsTitle: "标签",
    tagsDesc: "文章中使用的全部标签",
    postsTitle: "文章",
    postsDesc: "我发布的全部文章",
    archivesTitle: "归档",
    archivesDesc: "我归档的全部文章",
    searchTitle: "搜索",
    searchDesc: "搜索站内文章……",
  },
  a11y: {
    skipToContent: "跳到正文",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换主题",
    searchPlaceholder: "搜索文章……",
    noResults: "没有找到结果",
    goToPreviousPage: "上一页",
    goToNextPage: "下一页",
  },
  notFound: {
    title: "404 未找到",
    message: "页面不存在",
    goHome: "返回首页",
  },
} satisfies UIStrings;
```

- [ ] **Step 2: `src/components/Datetime.astro` 中文化日期**

在 imports 后增加：

```ts
import "dayjs/locale/zh-cn";
```

在 `dayjs.extend(timezone);` 后增加：

```ts
dayjs.locale("zh-cn");
```

把 `const date = datetime.format("D MMM, YYYY");` 改为：

```ts
const date = datetime.format("YYYY年M月D日");
```

- [ ] **Step 3: `src/styles/theme.css` 中文字体栈**

把 `--font-app: var(--font-google-sans-code);` 改为：

```css
  --font-app:
    var(--font-google-sans-code), "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif;
```

- [ ] **Step 4: 首页中文文案（`src/pages/index.astro`）**

① 把 `const { socials, posts: postsConfig } = config;` 改为：

```ts
const { socials, posts: postsConfig, site } = config;
```

② 把 hero 区（`<h1 ...>Mingalaba</h1>` 与随后两段 `<p>`）替换为：

```astro
      <h1 class="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">
        {site.title}
      </h1>
      <a
        target="_blank"
        href={`${import.meta.env.BASE_URL.replace(/\/?$/, "/")}rss.xml`}
        class="inline-block"
        aria-label="RSS Feed"
        title="RSS Feed"
      >
        <IconRss
          width={20}
          height={20}
          class="stroke-accent scale-125 stroke-3 rtl:-rotate-90"
        />
        <span class="sr-only">RSS Feed</span>
      </a>

      <p>
        你好，欢迎来到我的博客。这里记录学习、开发与生活的思考，主要写 Astro、前端与工具相关的内容。
      </p>
      <p class="mt-2">阅读文章，或从下方的最新内容开始；也可以订阅 RSS 获取更新。</p>
```

（保留原有的 `socials` 区块与后续 featured/recent 区块；文件末尾的 `<script>` 不动。）

- [ ] **Step 5: `src/components/Breadcrumb.astro` 中文分页文案**

把第 41 行的模板字符串：

```ts
`${t.nav.posts} (${t.pagination.page.toLowerCase()} ${breadcrumbList[1] || 1})`
```

改为：

```ts
`${t.nav.posts}（${t.pagination.page} ${breadcrumbList[1] || 1} 页）`
```

把第 54 行的模板字符串：

```ts
: `(${t.pagination.page.toLowerCase()} ${breadcrumbList[2]})`
```

改为：

```ts
: `（${t.pagination.page} ${breadcrumbList[2]} 页）`
```

- [ ] **Step 6: 类型检查与构建**

```powershell
pnpm check
pnpm build
```

Expected: 无类型错误；构建成功；Pagefind 索引数量与演示文章数一致。

- [ ] **Step 7: 验证中文渲染**

```powershell
Select-String -Path dist/index.html -Pattern 'lang="zh-CN"'
Select-String -Path dist/index.html -Pattern '你好，欢迎来到我的博客'
(Get-ChildItem dist/posts/*/index.html | Select-Object -First 1 | Select-String -Pattern '\d{4}年\d{1,2}月\d{1,2}日') | Select-Object -First 1
```

Expected: 三处均有命中（语言、首页文案、日期格式）。

- [ ] **Step 8: 提交**

```powershell
git add -A
git commit -m "feat: localize blog into chinese"
```

---

## Task 4: 示例内容（3 篇中文文章 + 关于页），删除演示内容

**Files:**
- Delete: `src/content/posts/` 下全部演示内容、`src/assets/images/` 下演示图片
- Create: `src/content/posts/hello-world.md`、`src/content/posts/how-to-write-posts.md`、`src/content/posts/deploy-to-github-pages.md`、`src/content/pages/about.md`

**Interfaces:**
- Consumes: 内容集合 schema（`title/description/pubDatetime/tags/draft/featured/author`）、Markdown 目录标题 `目录`（Task 2）。
- Produces: 3 个文章路由 `/blog/posts/{hello-world,how-to-write-posts,deploy-to-github-pages}/`、关于页 `/blog/about/`；Pagefind 索引 3 篇。

- [ ] **Step 1: 删除演示内容**

```powershell
Get-ChildItem src/content/posts -Force | Remove-Item -Recurse -Force
Remove-Item src/assets/images/* -Force -ErrorAction SilentlyContinue
```

Expected: `src/content/posts/` 为空目录；`src/assets/images/` 为空目录。

- [ ] **Step 2: 创建 `src/content/posts/hello-world.md`**

```markdown
---
title: "你好，世界：博客开张"
author: "alsl521"
pubDatetime: 2026-10-17T20:00:00+08:00
featured: true
draft: false
tags: ["随笔", "Astro"]
description: "博客的第一篇文章：记录建站过程、技术选型，以及之后想写的内容。"
---

## 目录

博客终于开张了。这篇文章简单记录一下建站过程，以及我打算在这里写些什么。

## 为什么要有一个自己的博客

把零散的学习笔记集中到一个可以长期维护的地方，也方便以后回头看自己踩过的坑。

## 技术栈

- **Astro**：静态站点生成，构建快、默认不输出多余 JavaScript。
- **AstroPaper**：成熟的主题基座，自带亮暗模式、标签、归档、RSS、搜索。
- **GitHub Pages**：免费托管，配合 GitHub Actions 推送后自动部署。

## 接下来写什么

前端开发、Astro 使用笔记、工具链配置，以及一些读后感和生活随笔。

## 联系我

欢迎通过 GitHub 找到我：<https://github.com/alsl521>。
```

- [ ] **Step 3: 创建 `src/content/posts/how-to-write-posts.md`**

````markdown
---
title: "如何写一篇文章"
author: "alsl521"
pubDatetime: 2026-10-16T10:00:00+08:00
draft: false
tags: ["教程", "Astro"]
description: "介绍本站文章的文件位置、frontmatter 字段、目录、代码块与草稿用法。"
---

## 目录

这篇文章说明如何在本博客新增一篇文章。

## 文件位置

在 `src/content/posts/` 下新建 `.md` 或 `.mdx` 文件，文件名就是文章 URL 的最后一段：

```text
src/content/posts/hello-world.md  ->  /blog/posts/hello-world/
```

子目录会进入 URL，例如 `src/content/posts/tools/vite.md` 对应 `/blog/posts/tools/vite/`。

## frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `description` | 是 | 摘要，用于列表与 SEO |
| `pubDatetime` | 是 | 发布时间（ISO 8601，带时区） |
| `modDatetime` | 否 | 更新时间 |
| `tags` | 否 | 标签数组，默认 `["others"]` |
| `draft` | 否 | `true` 时生产构建不展示 |
| `featured` | 否 | `true` 时出现在首页精选 |
| `ogImage` | 否 | 分享图，可写远程 URL 或相对路径 |

## 目录

在正文中写 `## 目录`，构建时会自动生成可折叠的目录。

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
````

- [ ] **Step 4: 创建 `src/content/posts/deploy-to-github-pages.md`**

````markdown
---
title: "把博客部署到 GitHub Pages"
author: "alsl521"
pubDatetime: 2026-10-15T09:00:00+08:00
draft: false
tags: ["教程", "GitHub"]
description: "本站的部署流程：仓库、GitHub Actions、Pages 设置，以及 base 路径常见问题。"
---

## 目录

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

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动安装依赖、构建并发布。构建流程包含：类型检查、Astro 构建、Pagefind 索引生成、上传 artifact。

## 为什么 URL 带 /blog/

这是 GitHub Pages **项目页**（`https://alsl521.github.io/blog/`）的部署方式。站点配置里：

```ts
site: { url: "https://alsl521.github.io", basePath: "/blog" }
```

所有站内链接、RSS、sitemap、搜索索引都会带上 `/blog/` 前缀。若以后改用用户主页仓库 `alsl521.github.io`，只需把 `basePath` 删除。

## 常见问题

- **页面 404**：先确认仓库 Settings → Pages 的 Source 是否为 GitHub Actions，再检查 `basePath` 与实际仓库名的对应关系。
- **搜索没结果**：确认构建日志里有 `Pagefind: 已索引 N 个页面`，且 `dist/pagefind/` 已上传。
- **样式丢失**：检查浏览器 Network 中 `_astro/` 资源是否返回 200，通常是 base 配置不一致导致。

## 手动构建预览

```bash
pnpm install
pnpm build
pnpm preview
```
````

- [ ] **Step 5: 创建 `src/content/pages/about.md`**

```markdown
---
title: "关于"
description: "关于这个博客和它的作者。"
---

你好，我是 alsl521。

这个博客用来记录学习过程中的笔记、开发中的实践和偶尔的思考，主要关注前端、Astro 与工具链。

## 关于本站

- 使用 [Astro](https://astro.build/) 构建，主题基于 [AstroPaper](https://github.com/satnaing/astro-paper) 定制。
- 文章以 Markdown 编写，静态部署在 GitHub Pages。
- 支持亮暗模式、标签、归档、RSS 与站内搜索。

## 找到我

- GitHub：<https://github.com/alsl521>
- 本站 RSS：`/blog/rss.xml`
```

- [ ] **Step 6: 构建并验证文章路由与目录**

```powershell
pnpm build
Test-Path dist/posts/hello-world/index.html, dist/posts/how-to-write-posts/index.html, dist/posts/deploy-to-github-pages/index.html, dist/about/index.html
Select-String -Path dist/posts/hello-world/index.html -Pattern '目录|<details'
Select-String -Path dist/tags/随笔/index.html -Pattern '随笔'
```

Expected: 全部 `True`；文章页命中 `目录` 与 `<details`（折叠目录生效）；中文标签页存在。

- [ ] **Step 7: 验证 Pagefind 只索引文章页**

```powershell
$env:BASE_PATH = "/blog"
node scripts/build-search-index.mjs
```

Expected: 日志出现 `Pagefind: 已索引 3 个页面`（若数量不符，检查文章 frontmatter 是否有 `draft: true` 或 `data-pagefind-body`）。

- [ ] **Step 8: 提交**

```powershell
git add -A
git commit -m "content: add chinese sample posts and about page"
```

---

## Task 5: 静态中文 OG 图

**Files:**
- Modify: `public/default-og.jpg`（替换主题自带图）

**Interfaces:**
- Consumes: `features.dynamicOgImage = false`、`site.ogImage = "default-og.jpg"`（Task 2）。
- Produces: 1200×630 的 JPG，供所有页面 `og:image` 使用。

- [ ] **Step 1: 用捆绑 Python + 系统字体生成 OG 图**

```powershell
$py = "python"  # 由运行环境提供的 Python（已安装 Pillow）；按实际解释器路径替换
$code = @'
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#fdfdfd")
draw = ImageDraw.Draw(img)
title_font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 76)
sub_font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 34)
url_font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 26)

draw.rectangle([40, 40, W - 40, H - 40], outline="#000000", width=4)
draw.rectangle([56, 56, W - 56, H - 56], outline="#ece9e9", width=2)
draw.text((96, 200), "alsl521 的博客", font=title_font, fill="#282728")
draw.text((96, 320), "记录学习与思考", font=sub_font, fill="#6b7280")
draw.line([(96, 392), (W - 96, 392)], fill="#006cac", width=4)
draw.text((96, 430), "https://alsl521.github.io/blog/", font=url_font, fill="#006cac")
img.save("public/default-og.jpg", "JPEG", quality=90)
print("OG image:", img.size)
'@
$code | & $py -
```

Expected: 输出 `OG image: (1200, 630)`；`public/default-og.jpg` 被覆盖。

- [ ] **Step 2: 构建并验证 OG 元信息**

```powershell
pnpm build
Select-String -Path dist/index.html -Pattern 'property="og:image"'
Select-String -Path dist/posts/hello-world/index.html -Pattern 'property="og:image"'
Test-Path dist/og.png
```

Expected: 两处 `og:image` 均为 `https://alsl521.github.io/blog/default-og.jpg`（或对应绝对 URL 含 `/blog/`）；`dist/og.png` 为 `False`。

- [ ] **Step 3: 提交**

```powershell
git add -A
git commit -m "feat: replace og image with chinese static banner"
```

---

## Task 6: 构建后自检脚本 + 中文 README

**Files:**
- Create: `scripts/check-site.mjs`
- Modify: `package.json`（新增 `check:site`）、`README.md`（整文件替换）

**Interfaces:**
- Consumes: Task 2-5 的全部构建产物与约定（site/base/zh-CN/Pagefind）。
- Produces: `pnpm check:site`（失败退出码 1）；中文 README（本地开发/写作/部署/配置/常见问题）。

- [ ] **Step 1: 创建 `scripts/check-site.mjs`**

```js
import fs from "node:fs";
import path from "node:path";

const SITE = (process.env.SITE_URL || "https://alsl521.github.io").replace(
  /\/+$/,
  ""
);
const BASE = (process.env.BASE_PATH || "/blog").replace(/\/+$/, "");
const DIST = "dist";

const failures = [];
const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok: Boolean(ok) });
  if (!ok) failures.push(detail ? `${name}: ${detail}` : name);
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function isExternal(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:|javascript:)/i.test(value);
}

if (!fs.existsSync(DIST)) {
  console.error(`未找到 ${DIST}/，请先运行 pnpm build`);
  process.exit(1);
}

for (const required of [
  "404.html",
  "rss.xml",
  "sitemap-index.xml",
  "sitemap-0.xml",
  "pagefind/pagefind-entry.json",
]) {
  check(`存在 dist/${required}`, fs.existsSync(path.join(DIST, required)));
}

const htmlFiles = walk(DIST).filter(file => file.endsWith(".html"));
const badLinks = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const value = match[1].trim();
    if (!value || isExternal(value) || !value.startsWith("/")) continue;
    if (!(value === BASE || value.startsWith(`${BASE}/`))) {
      badLinks.push(`${path.relative(DIST, file)} -> ${value}`);
    }
  }
}
check(
  "站内链接/资源均带 base 前缀",
  badLinks.length === 0,
  badLinks.slice(0, 10).join("; ")
);

const rss = fs.readFileSync(path.join(DIST, "rss.xml"), "utf8");
const rssLinks = [...rss.matchAll(/<link>([^<]+)<\/link>/g)].map(m => m[1]);
const badRss = rssLinks.filter(link => !link.startsWith(`${SITE}${BASE}/`));
check(
  "RSS 条目链接带 base",
  rssLinks.length > 0 && badRss.length === 0,
  badRss.slice(0, 5).join("; ")
);

const sitemap = fs.readFileSync(path.join(DIST, "sitemap-0.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const badLocs = locs.filter(loc => {
  const pathname = new URL(loc).pathname;
  return pathname !== BASE && !pathname.startsWith(`${BASE}/`);
});
check(
  "sitemap 链接带 base",
  locs.length > 0 && badLocs.length === 0,
  badLocs.slice(0, 5).join("; ")
);

const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
check("页面语言为 zh-CN", /<html[^>]*lang="zh-CN"/.test(indexHtml));
check(
  "RSS autodiscovery 无尾斜杠",
  !/application\/rss\+xml[^>]*rss\.xml\/"/.test(indexHtml)
);
check("无 favicon.ico 引用", !indexHtml.includes("favicon.ico"));
check("未生成动态 OG 路由", !fs.existsSync(path.join(DIST, "og.png")));
check(
  "主题切换脚本存在",
  indexHtml.includes('localStorage.getItem("theme")')
);

const postHtml = fs.readFileSync(
  path.join(DIST, "posts/hello-world/index.html"),
  "utf8"
);
check("文章页参与搜索索引", postHtml.includes("data-pagefind-body"));

const entryPath = path.join(DIST, "pagefind/pagefind-entry.json");
const entry = JSON.parse(fs.readFileSync(entryPath, "utf8"));
const languages = Object.keys(entry.languages ?? {});
check("Pagefind 索引语言非空", languages.length > 0, JSON.stringify(entry));

console.log(`Pagefind languages: ${languages.join(", ") || "(none)"}`);
for (const { name, ok } of results) console.log(`${ok ? "✓" : "✗"} ${name}`);

if (failures.length > 0) {
  console.error(`\n自检失败（${failures.length} 项）：`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`\n自检通过（${results.length} 项）。`);
```

- [ ] **Step 2: `package.json` 增加自检脚本**

在 `scripts` 中加入：

```json
    "check:site": "node scripts/check-site.mjs",
```

- [ ] **Step 3: 重写 `README.md`（完整内容）**

````markdown
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

> 注意：本站配置了 `base: "/blog"`，所以本地地址是 `/blog/` 开头。

常用命令：

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 类型检查 + 构建 + 生成搜索索引 |
| `pnpm preview` | 预览构建产物 |
| `pnpm check:site` | 构建后自检（base/RSS/sitemap/404/搜索索引） |
| `pnpm format` | 用 Prettier 格式化 |
| `pnpm lint` | ESLint 检查 |

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

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 标题 |
| `description` | 是 | 摘要 |
| `pubDatetime` | 是 | 发布时间（带时区） |
| `modDatetime` | 否 | 更新时间 |
| `tags` | 否 | 标签数组 |
| `draft` | 否 | `true` 时生产构建不输出 |
| `featured` | 否 | `true` 时进入首页精选 |
| `ogImage` | 否 | 分享图（远程 URL 或相对路径） |

其他约定：

- 正文写 `## 目录` 会自动生成可折叠目录。
- 图片推荐放 `src/assets/images/`，在正文用相对路径引用，构建时会自动优化并带上 `/blog/` 前缀。
- 中文标签直接写中文即可（例：`tags: ["随笔", "Astro"]`），URL 会自动编码。

## 站点配置

所有站点信息集中在 `astro-paper.config.ts`：

- `site.url`：站点域名（GitHub Pages 用户域名）
- `site.basePath`：部署子路径；本项目为 `/blog`。若改用用户主页仓库 `alsl521.github.io`，删除该字段
- `site.title / description / author / socials`：标题、描述、作者、社交链接
- `features.dynamicOgImage`：已关闭（中文动态 OG 图需要 CJK 字体），使用 `public/default-og.jpg`
- `features.search`：`pagefind` 站内搜索

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

如需评论，可按 <https://giscus.app/> 的指引操作：安装 Giscus App、开启仓库 Discussions、把生成的 `<script>` 片段放进 `src/pages/posts/[...slug]/index.astro` 的评论区位置（或新建 `src/components/Comments.astro` 引入）。本项目默认不启用，保持纯静态与零第三方脚本。

## 常见问题

- **线上 404**：确认 Pages Source 是 GitHub Actions，并检查 `site.basePath` 是否与实际仓库名一致。
- **搜索没有结果**：确认构建日志有 `Pagefind: 已索引 N 个页面`；开发环境需先 `pnpm build` 才有搜索索引。
- **样式或图片 404**：运行 `pnpm check:site`，检查是否所有站内 URL 都带 `/blog/`。

## 许可证

MIT，基于 AstroPaper（Copyright © 2023 Sat Naing）定制。详见 `LICENSE`。
````

- [ ] **Step 4: 格式化并运行自检**

```powershell
pnpm format
pnpm build
pnpm run check:site
```

Expected: `pnpm format` 无失败；`check:site` 输出全部 `✓` 且末行 `自检通过（N 项）。`。若失败，按输出修复（通常为 base 前缀或 autodiscovery 尾斜杠）。

- [ ] **Step 5: lint 与格式检查**

```powershell
pnpm lint
pnpm format:check
```

Expected: 均通过（无 error）。

- [ ] **Step 6: 提交**

```powershell
git add -A
git commit -m "docs: add chinese readme and dist self-check script"
```

---

## Task 7: GitHub Pages 部署工作流 + 端到端验收

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `.github/workflows/ci.yml`（pnpm 版本与 `packageManager` 对齐）

**Interfaces:**
- Consumes: Task 1-6 全部产物；`packageManager: pnpm@11.22.0`；`pnpm-lock.yaml` 已提交。
- Produces: push `main` 后自动构建并发布到 GitHub Pages；本地验收通过。

- [ ] **Step 1: 创建 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Install, build, and upload site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: 对齐主题 CI 的 pnpm 版本**

把 `.github/workflows/ci.yml` 中的 `version: "11.3.0"` 改为：

```yaml
          version: "11.22.0"
```

- [ ] **Step 3: YAML 结构检查（无 PyYAML 时的替代校验）**

```powershell
$yaml = Get-Content .github/workflows/deploy.yml -Raw
if ($yaml -match "`t") { throw "deploy.yml 含 tab 字符" }
$required = @(
  "name:", "on:", "permissions:", "jobs:",
  "contents: read", "pages: write", "id-token: write",
  "actions/checkout@v7", "withastro/action@v6", "actions/deploy-pages@v5",
  "environment:", "github-pages"
)
foreach ($needle in $required) {
  if (-not $yaml.Contains($needle)) { throw "deploy.yml 缺少: $needle" }
}
"deploy.yml 结构检查通过"
```

Expected: `deploy.yml 结构检查通过`。

- [ ] **Step 4: 完整构建 + 自检**

```powershell
pnpm build
pnpm run check:site
git ls-files --error-unmatch pnpm-lock.yaml
```

Expected: 构建成功；自检全部通过；`pnpm-lock.yaml` 已被跟踪。

- [ ] **Step 5: 端到端预览冒烟**

```powershell
$log = Join-Path $env:TEMP 'astro-preview.log'
$err = Join-Path $env:TEMP 'astro-preview.err.log'
Remove-Item $log, $err -Force -ErrorAction SilentlyContinue
$p = Start-Process -FilePath "node" -ArgumentList ".\node_modules\astro\astro.js","preview","--host","127.0.0.1","--port","4321" -PassThru -RedirectStandardOutput $log -RedirectStandardError $err -WindowStyle Hidden
try {
  Start-Sleep -Seconds 6

  $urls = @(
    "http://127.0.0.1:4321/blog/",
    "http://127.0.0.1:4321/blog/posts/",
    "http://127.0.0.1:4321/blog/posts/hello-world/",
    "http://127.0.0.1:4321/blog/tags/",
    "http://127.0.0.1:4321/blog/archives/",
    "http://127.0.0.1:4321/blog/about/",
    "http://127.0.0.1:4321/blog/search/",
    "http://127.0.0.1:4321/blog/rss.xml",
    "http://127.0.0.1:4321/blog/sitemap-index.xml"
  )
  foreach ($url in $urls) {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
    if ($res.StatusCode -ne 200) { throw "$url -> $($res.StatusCode)" }
  }
  "页面冒烟通过"

  $html = (Invoke-WebRequest -Uri $urls[0] -UseBasicParsing -TimeoutSec 20).Content
  $assets = [regex]::Matches($html, '(?:href|src)="(/blog/_astro/[^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  foreach ($asset in $assets) {
    $res = Invoke-WebRequest -Uri ("http://127.0.0.1:4321" + $asset) -UseBasicParsing -TimeoutSec 20
    if ($res.StatusCode -ne 200) { throw "$asset -> $($res.StatusCode)" }
  }
  "静态资源冒烟通过（$($assets.Count) 个）"

  $status = 0
  try {
    $null = Invoke-WebRequest -Uri "http://127.0.0.1:4321/blog/no-such-page/" -UseBasicParsing -TimeoutSec 20
  } catch {
    $status = [int]$_.Exception.Response.StatusCode
  }
  if ($status -ne 404) { throw "未知路径状态码应为 404，实际: $status" }
  "自定义 404 通过"
} finally {
  Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
}
```

Expected: 依次输出 `页面冒烟通过`、`静态资源冒烟通过（N 个）`、`自定义 404 通过`；无论成功失败，预览进程都会在 `finally` 中被停止。

- [ ] **Step 6: 最终检查**

```powershell
pnpm lint
pnpm format:check
git status --short
git log --oneline
```

Expected: lint/format 通过；`git status` 干净；提交历史包含 spec、各任务提交。

- [ ] **Step 7: 提交**

```powershell
git add -A
git commit -m "ci: add github pages deployment workflow"
```

---

## 执行后的交付检查（Lead 自检）

- [ ] 规格第 9 节全部验收项在 Task 6/7 中被实际执行并记录输出（不是口头声明）。
- [ ] `git log --oneline` 至少 7 个提交，工作区干净，`.research/`、`node_modules/`、`dist/`、`public/pagefind/` 未被跟踪。
- [ ] README 中的命令在干净环境（`pnpm install` 后）可复现。
- [ ] 向用户交付：本地预览地址、仓库创建与 push 步骤、首次部署后需要人工确认的检查项（Actions 成功、Pages URL、搜索点击）。
