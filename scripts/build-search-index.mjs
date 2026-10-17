import fs from "node:fs";
import path from "node:path";
import * as pagefind from "pagefind";

const siteDir = "dist";
const outputDir = path.join(siteDir, "pagefind");

if (!fs.existsSync(path.join(siteDir, "index.html"))) {
  throw new Error("dist/index.html 不存在，请先运行 astro build");
}

// 直接索引 dist（结果 URL 形如 /posts/xxx/，不含部署 base）。
// Pagefind 的 PagefindUI 会以 bundlePath（/blog/pagefind/）推导默认 baseUrl=/blog/，
// 并在 fullUrl() 里把它拼到结果 URL 上，因此项目页部署无需在索引阶段加 /blog/。
// 若在索引阶段再加一次 base，运行时会得到 /blog/blog/...（404）。
fs.rmSync(outputDir, { recursive: true, force: true });

const { index, errors } = await pagefind.createIndex();
if (errors.length > 0) throw new Error(errors.join("\n"));
if (!index) throw new Error("Pagefind: 无法创建索引");

const added = await index.addDirectory({ path: siteDir });
if (added.errors.length > 0) throw new Error(added.errors.join("\n"));
console.log(`Pagefind: 已索引 ${added.page_count} 个页面（root: ${siteDir}）`);

const written = await index.writeFiles({ outputPath: outputDir });
if (written.errors.length > 0) throw new Error(written.errors.join("\n"));

await index.deleteIndex();
await pagefind.close();
console.log(`Pagefind: 索引已写入 ${outputDir}`);
