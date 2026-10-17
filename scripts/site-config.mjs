import fs from "node:fs";

const FALLBACK = {
  siteUrl: "https://alsl521.github.io",
  basePath: "/blog",
};

/**
 * 读取站点配置，供构建脚本（Pagefind 索引、构建后自检）使用。
 * 以 `astro-paper.config.ts` 为单一配置源；环境变量可覆盖（CI/临时验证用）。
 *
 * 注意：配置文件存在但 `basePath` 被刻意删除（自定义域名/用户主页部署）时，
 * 返回空字符串而不是 fallback，否则搜索索引与自检会错误地按 /blog/ 处理。
 */
export function readSiteConfig() {
  let source = null;
  try {
    source = fs.readFileSync("astro-paper.config.ts", "utf8");
  } catch {
    // 配置文件不存在时退回默认值（脚本应在仓库根目录运行）
  }

  if (source === null) {
    return {
      siteUrl: process.env.SITE_URL ?? FALLBACK.siteUrl,
      basePath: process.env.BASE_PATH ?? FALLBACK.basePath,
    };
  }

  const urlMatch = source.match(/url:\s*["']([^"']+)["']/);
  const baseMatch = source.match(/basePath:\s*["']([^"']*)["']/);

  return {
    siteUrl: process.env.SITE_URL ?? urlMatch?.[1] ?? FALLBACK.siteUrl,
    basePath: process.env.BASE_PATH ?? baseMatch?.[1] ?? "",
  };
}
