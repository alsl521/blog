import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { readSiteConfig } from "./site-config.mjs";

const config = readSiteConfig();
const SITE = (process.env.SITE_URL ?? config.siteUrl).replace(/\/+$/, "");
const BASE = (process.env.BASE_PATH ?? config.basePath).replace(/\/+$/, "");
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
  "robots.txt",
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
const rssLinks = [...rss.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>/g)].map(
  match => match[1]
);
const badRss = rssLinks.filter(link => !link.startsWith(`${SITE}${BASE}/`));
check(
  "RSS 条目链接带 base",
  rssLinks.length > 0 && badRss.length === 0,
  badRss.slice(0, 5).join("; ")
);

const channelLink = rss.match(/<channel>[\s\S]*?<link>([^<]+)<\/link>/);
check(
  "RSS 频道链接指向博客根",
  channelLink ? channelLink[1].startsWith(`${SITE}${BASE}/`) : false,
  channelLink ? channelLink[1] : "缺少 channel link"
);
check("RSS 声明中文语言", rss.includes("<language>zh-cn</language>"));

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

const robots = fs.readFileSync(path.join(DIST, "robots.txt"), "utf8");
check(
  "robots.txt 指向带 base 的 sitemap",
  robots.includes(`Sitemap: ${SITE}${BASE}/sitemap-index.xml`),
  robots.trim()
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

const postHtmlFile = htmlFiles.find(file =>
  /^posts\/.+\/index\.html$/.test(
    path.relative(DIST, file).split(path.sep).join("/")
  )
);
check("存在至少一个文章页", Boolean(postHtmlFile), "dist/posts/*/index.html");
if (postHtmlFile) {
  const postHtml = fs.readFileSync(postHtmlFile, "utf8");
  check("文章页参与搜索索引", postHtml.includes("data-pagefind-body"));
  check("文章页中文目录折叠", postHtml.includes("<summary>展开目录</summary>"));
}

const entryPath = path.join(DIST, "pagefind/pagefind-entry.json");
const entry = JSON.parse(fs.readFileSync(entryPath, "utf8"));
const languageKeys = Object.keys(entry.languages ?? {});
check("Pagefind 索引语言非空", languageKeys.length > 0, JSON.stringify(entry));
const indexedPages = Object.values(entry.languages ?? {}).reduce(
  (total, value) => total + (value.page_count ?? 0),
  0
);
check("Pagefind 索引包含文章页", indexedPages >= 1, `page_count=${indexedPages}`);

// Pagefind 的默认 baseUrl 由 bundlePath 推导（/blog/pagefind/ -> /blog/），
// 运行时 fullUrl() 会把 baseUrl 拼到索引里的原始 URL 上。索引里若已带 base，
// 线上会得到 /blog/blog/...（404）。这里直接解压 fragment 做回归检查。
const fragmentFiles = walk(path.join(DIST, "pagefind")).filter(file =>
  file.endsWith(".pf_fragment")
);
const fragmentUrls = [];
for (const file of fragmentFiles) {
  try {
    const text = zlib.gunzipSync(fs.readFileSync(file)).toString("utf8");
    for (const match of text.matchAll(/"url":"([^"]+)"/g)) {
      fragmentUrls.push(match[1]);
    }
  } catch {
    // 非 gzip 格式的 fragment 忽略，不影响其他检查
  }
}
const hasDoubleBase = BASE
  ? fragmentUrls.some(url => url.startsWith(`${BASE}/`))
  : false;
check(
  "Pagefind 索引 URL 不含 base（避免运行时双前缀）",
  fragmentUrls.length > 0 && !hasDoubleBase,
  hasDoubleBase
    ? fragmentUrls.find(url => url.startsWith(`${BASE}/`))
    : "未解析到 fragment URL"
);
check(
  "Pagefind 索引包含文章 URL",
  fragmentUrls.some(url => /^\/posts\/.+\/$/.test(url)),
  fragmentUrls.slice(0, 5).join("; ")
);

const searchHtml = fs.readFileSync(path.join(DIST, "search/index.html"), "utf8");
check(
  "搜索页 bundlePath 带 base",
  searchHtml.includes(`data-bundle-path="${BASE}/pagefind/"`),
  "未找到 data-bundle-path"
);

console.log(`Pagefind languages: ${languageKeys.join(", ") || "(none)"}`);
console.log(`Pagefind indexed pages: ${indexedPages}`);
for (const { name, ok } of results) console.log(`${ok ? "✓" : "✗"} ${name}`);

if (failures.length > 0) {
  console.error(`\n自检失败（${failures.length} 项）：`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`\n自检通过（${results.length} 项）。`);
