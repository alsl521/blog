import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - Drafts are hidden in production builds, but visible in dev for authoring.
 * - In production, excludes scheduled posts until `pubDatetime` minus the configured margin
 * - In dev, always shows non-scheduled posts to make authoring easier
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  const isDraftVisible = !data.draft || import.meta.env.DEV;
  return isDraftVisible && (import.meta.env.DEV || isPublishTimePassed);
}
