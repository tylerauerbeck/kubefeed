import { readFileSync } from "fs";
import { join } from "path";
import { H3Event, createError, getQuery } from "h3";

interface Release {
  name: string | null;
  tag: string;
  published_date: string;
  url: string;
  draft: boolean;
  prerelease: boolean;
  release_notes?: string | null;
}

interface ReleasesFile {
  releases: Release[];
  count: number;
  last_updated: string;
}

function parseBooleanParam(value: unknown): boolean | undefined {
  if (typeof value !== "string") return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRssFeed(releases: Release[], lastUpdated: string, baseUrl: string): string {
  const items = releases.map((release) => {
    const title = release.name || release.tag;
    const description = release.release_notes 
      ? escapeXml(release.release_notes.substring(0, 500) + (release.release_notes.length > 500 ? "..." : ""))
      : `Kubernetes ${release.tag} release`;
    const pubDate = new Date(release.published_date).toUTCString();
    
    let categories = "";
    if (release.draft) {
      categories += `    <category>draft</category>\n`;
    }
    if (release.prerelease) {
      categories += `    <category>prerelease</category>\n`;
    }

    return `  <item>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(release.url)}</link>
    <guid isPermaLink="true">${escapeXml(release.url)}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
${categories}  </item>`;
  }).join("\n");

  const buildDate = new Date(lastUpdated).toUTCString();
  const currentDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kubefeed - Kubernetes Releases</title>
    <link>${baseUrl}</link>
    <description>Official Kubernetes release feed from Kubefeed</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <atom:link href="${baseUrl}/api/feeds/rss" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

export default defineEventHandler((event: H3Event) => {
  try {
    const { draft, prerelease, notes, tag } = getQuery(event);

    const draftBool = parseBooleanParam(draft);
    const prereleaseBool = parseBooleanParam(prerelease);
    const notesBool = parseBooleanParam(notes);

    if (draft !== undefined && draftBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'draft': must be 'true' or 'false'.",
      });
    }
    if (prerelease !== undefined && prereleaseBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'prerelease': must be 'true' or 'false'.",
      });
    }
    if (notes !== undefined && notesBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'notes': must be 'true' or 'false'.",
      });
    }

    const filePath = join(process.cwd(), "server", "data", "kubernetes-releases.json");
    let fileData: ReleasesFile;
    try {
      fileData = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (err) {
      throw createError({
        statusCode: 500,
        statusMessage: "Unable to read server/data/kubernetes-releases.json.",
      });
    }

    let filtered: Release[] = fileData.releases;

    if (draftBool !== undefined) {
      filtered = filtered.filter((rel) => rel.draft === draftBool);
    }
    if (prereleaseBool !== undefined) {
      filtered = filtered.filter((rel) => rel.prerelease === prereleaseBool);
    }

    // If tag is specified, filter to just that tag
    if (typeof tag === "string" && tag.length > 0) {
      filtered = filtered.filter((rel) => rel.tag === tag);

      // If no release is found with that tag, return 404
      if (filtered.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: `Release with tag '${tag}' not found.`,
        });
      }
    }

    // Include or exclude release_notes based on notes parameter
    let releasesList: Release[];
    if (notesBool === true) {
      releasesList = filtered;
    } else {
      releasesList = filtered.map(({ release_notes, ...rest }) => ({
        ...rest,
        release_notes: undefined
      }));
    }

    // Get the base URL from the request
    const host = event.node.req.headers.host || "localhost:3000";
    const protocol = event.node.req.headers["x-forwarded-proto"] || "http";
    const baseUrl = `${protocol}://${host}`;

    // Generate RSS feed
    const rssFeed = generateRssFeed(releasesList, fileData.last_updated, baseUrl);

    // Set the content type to RSS XML
    event.node.res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    
    return rssFeed;
  } catch (error: any) {
    if (error.statusCode && error.statusMessage) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Unhandled error in feeds/rss endpoint.",
    });
  }
});
