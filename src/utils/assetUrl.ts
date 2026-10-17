/**
 * 把站内相对/根路径资源解析为带 base 的绝对 URL；远程 URL 原样返回。
 *
 * 例：base=/blog/、origin=https://alsl521.github.io 时
 * - `images/og.jpg`      -> https://alsl521.github.io/blog/images/og.jpg
 * - `/images/og.jpg`     -> https://alsl521.github.io/blog/images/og.jpg
 * - `/blog/images/og.jpg` -> 不重复拼接 base
 * - `https://example.com/og.jpg` -> 原样返回
 */
export function toAbsoluteAssetUrl(
  value: string,
  origin: URL | string = "/"
): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return value;

  const base = normalizeBase(import.meta.env.BASE_URL || "/");
  const originUrl = new URL(typeof origin === "string" ? origin : origin.href);

  if (value.startsWith(base)) {
    return new URL(value, originUrl).href;
  }

  return new URL(`${base}${value.replace(/^\/+/, "")}`, originUrl).href;
}

/** Astro 的 BASE_URL 在不同版本/配置下可能缺少结尾斜杠，这里统一成 `/x/` 形式。 */
function normalizeBase(value: string): string {
  let base = value.startsWith("/") ? value : `/${value}`;
  if (!base.endsWith("/")) base = `${base}/`;
  return base;
}
