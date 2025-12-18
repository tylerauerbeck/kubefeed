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

    // Omit release_notes unless notes=true
    let releasesList: Release[];
    if (notesBool === true) {
      releasesList = filtered;
    } else {
      releasesList = filtered.map(({ release_notes, ...rest }) => rest);
    }

    // Create tag-to-release map (single object per tag)
    const releasesByTag: Record<string, Release> = {};
    for (const rel of releasesList) {
      releasesByTag[rel.tag] = rel;
    }

    return {
      releases: releasesByTag,
      count: releasesList.length,
      last_updated: fileData.last_updated,
    };
  } catch (error: any) {
    if (error.statusCode && error.statusMessage) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Unhandled error in feeds/json endpoint.",
    });
  }
});
