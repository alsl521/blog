import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

function toSiteUrl(): string {
  const base = config.site.basePath?.replace(/\/+$/, "") ?? "";
  return new URL(`${base}/`, config.site.url).href;
}

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
    site: toSiteUrl(),
    customData: "<language>zh-cn</language>",
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: toAbsoluteUrl(getPostUrl(id, filePath, config.site.lang)),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
