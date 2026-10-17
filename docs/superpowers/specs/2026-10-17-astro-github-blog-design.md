# 基于 Astro 的 GitHub 中文个人博客 — 设计规格

> **已迁移说明（2026-10-17）**：本站主题已由 AstroPaper 切换为 Firefly（Astro 7 + Vue + Tailwind 4），本文档保留为历史设计记录；当前实现以代码与 `docs/theme-migration-firefly-2026-10-17.md` 为准。

- 日期：2026-10-17（Asia/Shanghai）
- 状态：待用户审阅（设计方案已获用户口头批准，本文档为书面规格）
- 工作区：仓库根目录（项目代码与过程文档同仓）
- 关联核查记录：`.research/astro7-blog-notes.md`、`.research/theme-astropaper.md`、`.research/theme-alternatives.md`

## 1. 目标与成功标准

为 alsl521 创建并交付一个基于 Astro 的中文个人博客，托管在 GitHub Pages 项目页：

- 仓库：`alsl521/blog`；访问地址：`https://alsl521.github.io/blog/`
- 写作：Markdown（内容集合 + frontmatter 校验），可选 MDX
- 功能：首页/文章列表/文章详情/标签/归档/关于/搜索、亮暗主题、折叠目录、RSS、sitemap、自定义 404、每篇文章的 SEO/OG 元信息
- 部署：push 到 `main` 后 GitHub Actions 自动构建并发布；本地 `pnpm dev` 可预览
- 界面文案与示例文章：简体中文
- 站点信息（用户已确认）：标题「alsl521 的博客」，作者 alsl521，描述「记录学习与思考」，时区 Asia/Shanghai

成功标准 = 第 9 节的验收清单全部通过。

## 2. 事实依据与约束

环境（2026-10-17 实查）：Node v24.14.1、npm 11.11.0、pnpm 11.22.0、git 2.53.0；git 身份已配置；npm registry 可访问（registry.npmjs.org）；GitHub 可通过 git 访问；本机**没有 gh CLI**。

主题基座：**AstroPaper（satnaing/astro-paper）main 分支**。

- 最新 tag `v6.1.0`（2026-06）仍锁定 Astro 6.4.2；main 分支已合入 Astro 7 升级（`feat: astro v7 upgrade (#664)`，2026-07），`package.json` 为 `astro ^7.0.3`、`@astrojs/mdx ^7.0.0`、`typescript ^6.0.3`、Tailwind 4、Pagefind 1.5。
- 本次使用的 main 快照 commit：`35cfa7fbe0b897306d27670d3819e55d5205f3dd`（2026-08-05，`fix: move focus to main content… (#665)`）；README 中记录该来源。
- 仓库自带 `pnpm-lock.yaml`（锁定 astro 7.0.3 等具体版本），将原样保留，**不执行 `pnpm up`**。
- MIT 许可，`is_template: true`；结构：109 个 src 文件（约 3.3 万行含演示内容）、11 个组件、2 个布局、`astro-paper.config.ts` 单点配置。
- 已具备 base 路径工具链（`src/utils/withBase.ts` 的 `getAssetPath`/`stripBase`；页面链接统一走 `getRelativeLocaleUrl`；源码 0 处硬编码 `href="/…"`），但 `astro.config.ts` 未暴露 `base`。
- i18n 骨架：`src/i18n/index.ts` 按 `src/i18n/lang/*.ts` 文件名自动加载，`UIStrings` 类型约束共 47 个叶子键；目前只有 `en.ts`。
- 已知上游未修复问题（本项目需自行修）：
  1. Pagefind 主题未配置 `baseUrl`（`search.astro`）。实测 Pagefind 1.5 会从 `bundlePath` 推导默认 `baseUrl`；本项目最终采用「直接索引 dist + 不显式传 baseUrl」方案（见 §13），显式传 `/blog` 反而会产生 `/blog/blog/...`。
  2. `Layout.astro` 中 RSS autodiscovery 链接生成 `…/rss.xml/`（尾部斜杠）→ 404（上游 PR #676 未合）。
  3. `pnpm build` 脚本尾部含 `cp -r` → Windows 下必失败（上游 issue #680 / PR #681 未合）。
  4. 动态 OG 图（Satori + Google Sans Code）不含中文字形 → 中文标题渲染为方块。
  5. `Layout.astro` 引用 `public/favicon.ico`，但主题仓库只有 `public/favicon.svg` → 该请求 404。
- 备选主题核查结论（详见 `.research/theme-alternatives.md`）：Fuwari 锁定 Astro 5 且 peer 不兼容 7；Cactus 明确不支持子目录部署；Nano/Sphere 长期不维护。AstroPaper 是唯一同时满足「Astro 7 原生可用 + 支持 base + 功能贴合 + 活跃维护」的候选。

## 3. 架构总览

纯静态单页应用（Astro SSG，无服务端）：

```
Markdown/MDX (src/content/posts)
        │ 内容集合（glob loader + Zod schema）
        ▼
Astro 页面/布局/组件（SSG 预渲染）
        │ astro build（含 astro check 类型检查）
        ▼
dist/（HTML + _astro 资源 + rss.xml + sitemap-*.xml + 404.html）
        │ pagefind --site dist（生成 dist/pagefind 静态搜索索引）
        ▼
GitHub Actions：upload artifact → deploy-pages → https://alsl521.github.io/blog/
```

运行时唯一客户端脚本：主题切换、移动端菜单、Pagefind 搜索（动态 import）；其余为静态 HTML/CSS。

## 4. 仓库结构

采用 AstroPaper 目录结构，删除演示内容，新增下列文件：

```
/
├── astro-paper.config.ts          # 站点单点配置（改这里即可换站点信息）
├── astro.config.ts                # Astro 配置（base / i18n / markdown / fonts）
├── package.json                   # 脚本 + packageManager
├── pnpm-lock.yaml                 # 保留主题锁定版本（astro 7.0.3 等）
├── pnpm-workspace.yaml            # allowBuilds: esbuild, sharp
├── tsconfig.json / eslint / prettier 配置（沿用主题）
├── README.md                      # 中文使用与部署说明（重写）
├── LICENSE                        # 保留 MIT 与上游版权声明
├── docs/superpowers/specs/…       # 本规格与后续实施计划
├── scripts/
│   ├── copy-pagefind.mjs          # 跨平台复制搜索索引到 public/（dev 用）
│   └── check-site.mjs             # 构建后自检（base/RSS/sitemap/404/索引）
├── .github/workflows/deploy.yml   # GitHub Pages 部署工作流（新增）
├── public/
│   ├── default-og.jpg             # 重新生成的静态 OG 图（1200×630，中文）
│   ├── favicon.svg / favicon.ico  # 沿用主题
│   └── pagefind/                  # 构建生成（gitignore）
└── src/
    ├── config.ts                  # 解析默认值（沿用，site.basePath 透传）
    ├── types/config.ts            # 新增 site.basePath?: string
    ├── content.config.ts          # 保留（posts + pages 集合）
    ├── content/posts/*.md         # 3 篇中文示例文章（替换演示文章）
    ├── content/pages/about.md     # 中文关于页
    ├── i18n/lang/zh-CN.ts         # 新增（47 键中文翻译）
    ├── i18n/lang/en.ts            # 保留（回退）
    ├── layouts/{Layout,PostLayout}.astro
    ├── components/*               # 11 个组件沿用
    ├── pages/*                    # 首页/列表/详情/标签/归档/关于/搜索/RSS/OG/404
    ├── styles/{global,theme,typography}.css
    └── utils/*                    # 沿用（withBase 等）
```

其它约定：保留主题 `.gitignore`（已含 `dist/`、`.astro/`、`node_modules/`、`public/pagefind`、`.env`），追加 `.research/`（过程资料不进入仓库）；`docs/` 下的设计与计划文档纳入仓库。

## 5. 详细设计

### 5.1 站点单点配置 `astro-paper.config.ts`

```ts
export default defineAstroPaperConfig({
  site: {
    url: "https://alsl521.github.io",   // origin，不含 base
    basePath: "/blog",                  // GitHub Pages 项目页子路径；用户主页部署时删掉
    title: "alsl521 的博客",
    description: "记录学习与思考",
    author: "alsl521",
    profile: "https://github.com/alsl521",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: { perPage: 6, perIndex: 4, scheduledPostMargin: 15 * 60 * 1000 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,              // 中文缺字，改用静态 OG 图
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: true, url: "https://github.com/alsl521/blog/edit/main/" },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/alsl521" }],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
```

- `src/types/config.ts`：`SiteConfig` 增加 `basePath?: string`；`ResolvedSiteConfig` 不强制包含它（可选）。
- `src/config.ts`：`site` 展开 `...userConfig.site`，`basePath` 自动透传，无需另加逻辑。

### 5.2 `astro.config.ts`

变更点：

1. `site: config.site.url`；新增 `base: config.site.basePath`。
2. i18n 改为中文单语言：
   ```ts
   i18n: {
     locales: ["zh-CN"],
     defaultLocale: "zh-CN",
     routing: { prefixDefaultLocale: false },
   },
   ```
3. Markdown 插件改中文目录标题（示例文章统一使用 `## 目录`）：
   ```ts
   markdown: {
     processor: unified({
       remarkPlugins: [
         [remarkToc, { heading: "目录", maxDepth: 3 }],
         [remarkCollapse, { test: "目录" }],
       ],
       rehypePlugins: [rehypeCallouts],
     }),
     ...
   }
   ```
   实现时先验证 `remark-toc` 是否支持 `heading`/`maxDepth` 选项：支持则按上述配置；不支持则退回主题默认的 `## Table of contents`（示例文章改用英文标题），并在实施计划中记录取舍。
4. 保留 Shiki 双主题、transformers、`fonts`（Google Sans Code，供拉丁字符与主题使用）、`env` schema；不设置 `trailingSlash`（保持主题默认 `directory` 构建，GitHub Pages 对目录 URL 的 301 行为可接受）。

### 5.3 中文化

- 新增 `src/i18n/lang/zh-CN.ts`：实现 `UIStrings` 全部 47 个叶子键（导航 posts/tags/about/archives/search/home、文章页 publishedAt/updatedAt/share/tagLabel/backToTop/goBack/editPage/prev/next、分页 prev/next/page、首页 socialLinks/featured/recentPosts/allPosts、footer copyright/allRightsReserved、标签/归档/搜索/404 页文案、8 个无障碍文案），键名与 `en.ts` 完全一致。
- `src/i18n/index.ts` 自动发现 `zh-CN.ts`，无需修改；`useTranslations("zh-CN")` 命中，缺失键回退英文。
- 日期：`src/components/Datetime.astro` 增加 `import "dayjs/locale/zh-cn"` 与 `dayjs.locale("zh-cn")`，格式改为 `YYYY年M月D日`（保留 `datetime` 属性的 ISO 时间）。
- 字体：`src/styles/theme.css` 的 `--font-app` 改为
  `var(--font-google-sans-code), "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif`，
  正文中文走系统字体，避免下载数 MB 的 CJK 字体；表头/代码字体不变。
- 首页 `src/pages/index.astro`：把 "Mingalaba" 与主题介绍段落替换为站点标题 + 简短中文介绍 + RSS 链接说明；保留 featured/recent 区块与社交链接。
- 关于页 `src/content/pages/about.md`：中文模板（占位可改）。

### 5.4 base 路径与上游坑修复

- `base: "/blog"` 由 5.2 设置；主题链接/资源工具链已适配，构建后用 `scripts/check-site.mjs` 全量校验。
- **修复 Pagefind base（最终实现）**：`scripts/build-search-index.mjs` 直接索引 `dist/`（索引内 URL 为 `/posts/...`），由 Pagefind 依据 `bundlePath`（`/blog/pagefind/`）推导默认 `baseUrl=/blog/`；**不要**再给 `PagefindUI` 传 `baseUrl`（会双前缀）。`pnpm check:site` 会解压 fragment 断言索引 URL 以 `/posts/` 开头且不含 `/blog/`。
- **修复 RSS autodiscovery**：`src/layouts/Layout.astro` 的 `rssHref` 改为 `getAssetPath("rss.xml")`（而非 `getRelativeLocaleUrl(locale, "rss.xml")` 产生的 `rss.xml/`），`<link rel="alternate">` 的 `href` 仍用 `new URL(rssHref, Astro.site)` 生成绝对 URL，最终形如 `https://alsl521.github.io/blog/rss.xml`。
- **RSS feed 校验**：`src/pages/rss.xml.ts` 的 `item.link` 由 `getPostUrl()` 生成；构建后检查 `dist/rss.xml` 中每个 `<link>` 是否以 `https://alsl521.github.io/blog/` 开头，缺失则改为绝对 URL（`new URL(link, config.site.url + basePath)`）或 `withBase()` 拼接。
- **sitemap 校验**：构建后检查 `dist/sitemap-0.xml` 的 `<loc>` 是否包含 `/blog/`；若缺失，在 `astro.config.ts` 的 `sitemap({ serialize })` 中补 base（用 `config.site.basePath` 拼接，**不要**在配置层 import `src/utils/withBase`——那里依赖 `import.meta.env.BASE_URL`，在配置上下文不可用）。
- **canonical / OG**：`Layout.astro` 的 `canonicalURL` 已用 `new URL(Astro.url.pathname, Astro.site)`，构建后抽查文章页 `<link rel="canonical">` 是否为带 `/blog/` 的绝对 URL；OG 图 URL 由 `resolveDefaultOgImagePath` → `getAssetPath` 生成，已含 base。
- **favicon 404**：删除 `Layout.astro` 中对不存在的 `favicon.ico` 的引用（或补充该文件），构建后资源检查确保无 404。
- **404**：保留 `src/pages/404.astro`，产出 `dist/404.html`。
- **开发服务器**：`pnpm dev` 在 `http://localhost:4321/blog/` 提供服务（base 生效）。

### 5.5 构建脚本（跨平台）

`package.json`：

```json
{
  "packageManager": "pnpm@11.22.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build && pagefind --site dist && node scripts/copy-pagefind.mjs",
    "preview": "astro preview",
    "sync": "astro sync",
    "astro": "astro",
    "check": "astro check",
    "check:site": "node scripts/check-site.mjs",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
```

- `scripts/copy-pagefind.mjs`：`fs.cpSync("dist/pagefind", "public/pagefind", { recursive: true })`，供 `pnpm dev` 时搜索可用（保留主题原有行为，改用 Node 实现）。
- 新增 `scripts/check-site.mjs`：静态审计 `dist/`，检查项见第 9 节；失败时 `process.exit(1)` 并打印明细。
- 不升级依赖版本；`typescript` 保持 `^6.0.3`（满足 `@astrojs/check` 的 peer `^5 || ^6`）。

### 5.6 内容

删除主题演示文章与演示图片（`src/content/posts` 下全部演示文件、`_color-schemes`、`_releases`、`examples` 及对应 assets），新增 3 篇中文示例文章 + 1 个关于页，frontmatter 满足现有 schema（`title/description/pubDatetime/tags/draft/author(默认)/featured/ogImage` 可选）：

1. `hello-world.md` —「你好，世界：博客开张」：站点介绍、如何联系、后续计划；正文含 `## 目录`（用于验证折叠 TOC）。
2. `how-to-write-posts.md` —「如何写一篇文章」：frontmatter 字段表、目录写法、代码块高亮、标签、草稿（`draft: true`）、图片引用说明。
3. `deploy-to-github-pages.md` —「把博客部署到 GitHub Pages」：仓库创建、Pages 源设置、工作流、`base` 路径说明、常见 404 排查。
4. `src/content/pages/about.md` —「关于」中文简介。

补充约定（`ogImage` 的 schema 语义，复核后回填）：文章 `ogImage` 支持**远程 URL**，或**相对文章文件且真实存在于 `src/` 下的图片**（`image()` 会优化为 `_astro` 资源）；**不支持** `public/` 路径（会在 schema 阶段触发 `ImageNotFound`）。站点级默认分享图通过 `site.ogImage`（`public/default-og.jpg`）配置与替换。

标签使用中文（如「随笔」「教程」「Astro」「GitHub」）；`pubDatetime` 使用 ISO 日期；示例文章内容为可替换的教学性内容。

### 5.7 OG 图与静态资源

- `features.dynamicOgImage: false`；`site.ogImage: "default-og.jpg"`。
- 用 Python（Pillow，捆绑环境）+ Windows 系统字体（`msyh.ttc` 等）生成 `public/default-og.jpg`：1200×630、浅色背景、站点标题「alsl521 的博客」+ 副标题「记录学习与思考」；生成命令一次性执行，脚本不纳入仓库（README 说明如何替换分享图）。
- favicon 沿用主题 `public/favicon.svg`、`public/favicon.ico`。
- `LICENSE` 保留 MIT 原文（上游版权声明）；README 中注明基于 AstroPaper 定制。

### 5.8 部署工作流 `.github/workflows/deploy.yml`

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
      - uses: actions/checkout@v7
      - uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- `withastro/action@v6` 读取 `pnpm-lock.yaml` 自动使用 pnpm + Node 24，执行 `pnpm run build` 后上传 `dist`；无需手写 configure-pages/upload-pages-artifact。
- `packageManager: pnpm@11.22.0` 避免 CI 包管理器版本漂移。
- 保留主题自带 `.github/workflows/ci.yml`（PR 时跑 lint/format/build）；提交前本地必须跑通 `pnpm lint`、`pnpm format:check`、`pnpm build`。

### 5.9 README（中文）

包含：项目简介与技术栈、目录结构、本地开发（Node ≥22.22、pnpm、`pnpm install/dev/build/preview`）、写文章指南（frontmatter 字段、目录、标签、草稿）、站点配置说明（`astro-paper.config.ts` 的标题/描述/作者/社交/分享/OG）、部署步骤（创建仓库 → Pages Source=GitHub Actions → push）、`base` 与站点 URL 的关系、自定义域名要点、评论（Giscus）接入说明、许可与上游致谢。

## 6. 数据流

- **开发**：`pnpm dev` → Astro dev server（`/blog/` 前缀）→ 内容集合按需加载；搜索依赖上一次 `pnpm build` 复制到 `public/pagefind` 的索引。
- **构建**：`astro check`（类型检查）→ `astro build`（SSG 输出 `dist/`，生成 RSS/sitemap/OG/404，Shiki 内联高亮）→ `pagefind --site dist`（生成静态索引）→ `copy-pagefind`（复制索引到 `public/`）→ `check-site.mjs`（可选，验收时运行）。
- **部署**：push `main` → Actions：checkout → withastro/action（pnpm install --frozen-lockfile、pnpm build、upload artifact）→ deploy-pages（发布 artifact 到 Pages）。
- **浏览器**：静态 HTML/CSS；主题脚本从 localStorage/媒体查询决定暗色；搜索页动态 import Pagefind UI，请求 `/blog/pagefind/` 下的索引。

## 7. 失败模式与处理

| 失败场景 | 表现 | 处理 |
| --- | --- | --- |
| 依赖安装失败（lockfile 与 registry 不匹配） | `pnpm install --frozen-lockfile` 报错 | 不改版本，先重试/清缓存；确认 Node 24、pnpm 11 |
| `astro check` 类型错误（i18n 键缺失等） | 构建前失败 | 按 `UIStrings` 补全 `zh-CN.ts` 键，不引入 `any` |
| `pagefind` 命令不可用 | `pnpm build` 失败 | `pagefind` 已在 devDependencies；若缺失则 `pnpm add -D pagefind@^1.5.2` |
| 构建期下载 Google 字体失败 | 构建报网络错误 | 临时移除 `fonts` 配置并改用系统字体栈（README 记录该开关） |
| base 遗漏（链接/资源/RSS/sitemap） | 线上 404 | `pnpm check:site` 构建后审计 → 补 `withBase`/`getAssetPath`/`serialize` |
| 搜索点击 404 | 结果 URL 出现 `/blog/blog/...` 或缺少 base | 构建脚本直接索引 `dist`（索引 URL 无 base），依赖 Pagefind 从 `bundlePath` 推导 `baseUrl`；`pnpm check:site` 校验 fragment URL |
| RSS autodiscovery 404 | `<link rel=alternate>` 指向 `rss.xml/` | 改用 `getAssetPath("rss.xml")` |
| GitHub Pages 未开启 Actions 源 | 部署 job 失败 | README 明确：Settings→Pages→Source=GitHub Actions |
| Windows 构建脚本失败 | `cp` 不是内部命令 | 已替换为 `scripts/copy-pagefind.mjs` |
| 动态 OG 中文乱码/方块 | 分享图标题异常 | 已关闭动态 OG，使用静态 `default-og.jpg` |

## 8. 风险与对策

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| AstroPaper 的 Astro 7 支持只在未发版的 main | 上游未来变动 | 使用 main 快照 + 自带 lockfile 锁定版本；不 `pnpm up`；README 记录来源 commit |
| base 路径遗漏 | 线上大面积 404 | 构建后 `check-site.mjs` 静态审计 + `pnpm preview` HTTP 冒烟 |
| 中文翻译遗漏/键缺失 | 界面夹英文或 `astro check` 失败 | 以 `UIStrings` 类型约束驱动，`pnpm check` 把关 |
| 主题 CI（lint/format）因改动失败 | PR/推送检查红 | 提交前本地 `pnpm format && pnpm lint && pnpm format:check`，必要时按 prettier 规则修正 |
| 仓库名/用户名与假设不符 | 站点 URL/base 错误 | 配置单点（`astro-paper.config.ts`），README 写清修改方法 |
| 首次部署需用户手动操作 | 无法全自动上线 | 交付时给出逐步清单；本机无 gh CLI，不代为创建远程仓库 |

## 9. 验证与验收

**构建与静态审计**

1. `pnpm install --frozen-lockfile` 成功。
2. `pnpm check`（`astro check`）通过。
3. `pnpm build` 成功，产出 `dist/`；`pnpm check:site` 通过，检查项：
   - `dist/404.html`、`dist/rss.xml`、`dist/sitemap-index.xml`、`dist/sitemap-0.xml`、`dist/pagefind/` 存在；
   - 所有 `dist/**/*.html` 中以 `/` 开头的 `href`/`src` 均以 `/blog/` 开头（白名单：`//`、`http(s):`、`mailto:`、`#`、`data:`）；
   - `dist/rss.xml` 每个 `<link>` 以 `https://alsl521.github.io/blog/` 开头；
   - `dist/sitemap-0.xml` 每个 `<loc>` 包含 `/blog/`；
   - 首页/文章页 `<link rel="alternate" type="application/rss+xml">` 的 `href` 以 `/blog/rss.xml` 结尾（无尾斜杠）；
   - `dist/pagefind/` 索引文件存在且非空。
4. `pnpm lint`、`pnpm format:check` 通过（保留主题 CI 时必需）。

**HTTP 冒烟（`pnpm preview` 后）**

5. 返回 200：`/blog/`、`/blog/posts/`、`/blog/posts/hello-world/`、`/blog/tags/`、`/blog/archives/`、`/blog/about/`、`/blog/search/`、`/blog/rss.xml`、`/blog/sitemap-index.xml`；首页内引用的 CSS/JS 资源 URL 均 200。
6. `/blog/不存在页面/` 返回 404 且渲染自定义 404 内容。
7. 搜索页加载 Pagefind UI（构建后），索引包含 3 篇文章；结果链接路径以 `/blog/` 开头。
8. 文章页中文目录可折叠展开（`## 目录` + remark 插件生效），日期显示为 `YYYY年M月D日`，页面 `lang="zh-CN"`。
9. 亮/暗主题切换、移动端菜单可正常使用（静态检查脚本 + 人工/预览确认）。

**部署（用户推送后）**

10. GitHub Actions 的 build 与 deploy job 均成功；`https://alsl521.github.io/blog/` 可访问，CSS/字体/搜索/RSS 正常；Actions 记录中无 base 相关 404。

**仓库卫生**

11. `git status` 干净；`node_modules/`、`dist/`、`.astro/`、`.research/`、`public/pagefind/` 已被忽略；初始提交完成。

## 10. 不在本次范围（YAGNI）

- Giscus 评论、自定义域名、中英双语/多语言切换
- 除 Pagefind 外的搜索后端、图片画廊/作品集、Newsletter、分析统计
- 自动创建 GitHub 远程仓库并推送（本机无 gh CLI，且需要用户凭据）
- 升级 AstroPaper 依赖版本或合并上游后续改动

## 11. 假设

- **版本决策（2026-10-17 用户确认）**：锁定主题自带 `pnpm-lock.yaml` 中的版本（astro 7.0.3、typescript 6.0.3 等），**不升级到 Astro 7.4.0**；交付后用户只新增 Markdown 文章，不再改代码，因此以可复现性优先。
- GitHub 用户名 `alsl521`、仓库名 `blog`、站点标题/描述/作者按已确认内容。
- 用户自行在 GitHub 创建 `blog` 仓库并把 Pages 源设为 GitHub Actions，然后从本地 push。
- 示例文章与关于页内容为占位/教学性内容，用户后续替换。
- 不修改全局 Node/npm/pnpm 配置；项目内使用 pnpm 与锁文件。

## 12. 参考与核查记录

- `.research/astro7-blog-notes.md` — Astro 7 配置/内容集合/RSS/sitemap/GitHub Pages 部署事实核查
- `.research/theme-astropaper.md` — AstroPaper 源码与兼容性评估
- `.research/theme-alternatives.md` — 备选主题横评
- Astro 官方文档：Content Collections、RSS、Sitemap、GitHub Pages 部署、i18n
- AstroPaper 仓库：https://github.com/satnaing/astro-paper （main 分支，MIT）

## 13. 实施偏差记录（交付回填）

| 规格条目 | 最终实现 | 原因 |
| --- | --- | --- |
| §5.4 Pagefind 传 `baseUrl` | 改为直接索引 `dist`，不传 `baseUrl` | 实测显式传 `baseUrl` 会导致 `/blog/blog/...`；Pagefind 会从 `bundlePath` 推导 |
| §5.7 动态 OG 图 | 删除 `src/pages/og.png.ts` 与 per-post `index.png` 路由，仅保留静态 OG 图 | 构建期 Astro Fonts 拉取 fonts.google.com 超时；Satori + Google Sans Code 无中文字形 |
| §5.3 字体 | 移除 Astro Fonts / Google Sans Code，改用系统中文栈 | 同上（消除构建期外部网络依赖） |
| §5.4 `favicon.ico` | 删除引用 | 主题 `public/` 只有 `favicon.svg` |
| 构建脚本 | 新增 `ensure-pagefind-binary.mjs`（平台包下载兜底）与 `site-config.mjs`（脚本读取单一配置源） | 本机 pnpm 拉取 52MB 平台包超时；自定义域名需 base 自适应 |
| 草稿/时区/OG | 草稿 dev 可预览、归档按 `Asia/Shanghai` 分组、`ogImage` 自动补 base | 复核发现的行为缺陷，已修复并添加验证用例 |

## 14. 独立复核结论（最终）

- 复核范围：`4f429b9..389e207`（main）；两轮独立复核，均为只读审查 + 构建/静态检查 + headless 浏览器实测。
- 验证结果：`pnpm build` 退出码 0（14 页，Pagefind `page_count=3`）；`pnpm run check:site` 25/25；`pnpm lint`、`pnpm format:check` 通过；headless Chrome 搜索 10 条结果全部为 `/blog/posts/...`（无 `/blog/blog/...`）；中文日期/TOC/主题切换/移动菜单/复制按钮实测通过；root（自定义域名）部署在临时副本中验证通过。
- 结论：**无 Critical**。复核发现的 Pagefind 双 base（Critical）已修复并回归验证；`ogImage` 文档与 schema 不一致（Important）与本节结论过时（Important）已在本次文档提交修正；提交历史中的作者邮箱是否公开（Important）由用户在首次 push 前决定，见交付说明。
- Minor（延后处理）：M1 英文 a11y 文案；M2 动态 OG 死代码与未用 `satori`；M3 `.env*.local` 未忽略；M4 默认标签 `others`；M5 404 canonical/noindex；M6 CI 未跑 `check:site`；M7 自定义域名文案/OG 图硬编码 `/blog`；M8 `assetUrl.ts` 默认 origin 参数；M9 默认 OG 未进 JSON-LD。
- 可审计证据：本规格 §13/§14、提交历史（`4f429b9..389e207`）、`pnpm build`/`check:site`/`lint`/`format:check` 输出；复核报告为过程产物（本地 `.research/`，未纳入仓库）。
- 修复记录：复核期间发现的 Pagefind 双 base（Critical）已在 `cdb147a` 修复并回归；其余 Important 项在 `cccc6d7` 修复并验证。
