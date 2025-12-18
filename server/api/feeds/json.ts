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
    const { draft, prerelease, notes, tag, supported } = getQuery(event);

    // Parse boolean parameters, with defaults for draft and prerelease
    const draftParsed = parseBooleanParam(draft);
    const prereleaseParsed = parseBooleanParam(prerelease);
    const notesBool = parseBooleanParam(notes);
    const supportedBool = parseBooleanParam(supported);

    // Validate draft parameter if provided
    if (draft !== undefined && draftParsed === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'draft': must be 'true' or 'false'.",
      });
    }
    // Validate prerelease parameter if provided
    if (prerelease !== undefined && prereleaseParsed === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'prerelease': must be 'true' or 'false'.",
      });
    }
    
    // Set defaults: draft and prerelease default to false (exclude by default)
    const draftBool = draftParsed ?? false;
    const prereleaseBool = prereleaseParsed ?? false;
    if (notes !== undefined && notesBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'notes': must be 'true' or 'false'.",
      });
    }
    if (supported !== undefined && supportedBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'supported': must be 'true' or 'false'.",
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

    // Calculate supported versions if needed
    let supportedMinorVersions: string[] = [];
    if (supportedBool === true) {
      // Get all stable releases (non-draft, non-prerelease)
      const stableReleases = fileData.releases.filter((rel) => !rel.draft && !rel.prerelease);
      
      // Extract unique minor versions from stable releases
      const minorVersionsSet = new Set<string>();
      stableReleases.forEach((rel) => {
        const match = rel.tag.match(/^v(\d+)\.(\d+)\./);
        if (match) {
          minorVersionsSet.add(`${match[1]}.${match[2]}`);
        }
      });
      
      // Sort minor versions in descending order
      const sortedMinors = Array.from(minorVersionsSet).sort((a, b) => {
        const [aMaj, aMin] = a.split('.').map(Number);
        const [bMaj, bMin] = b.split('.').map(Number);
        if (aMaj !== bMaj) return bMaj - aMaj;
        return bMin - aMin;
      });
      
      // Get the top 3 supported minor versions
      supportedMinorVersions = sortedMinors.slice(0, 3);
    }

    // Apply draft filter (defaults to false - exclude drafts)
    filtered = filtered.filter((rel) => rel.draft === draftBool);
    
    // Apply prerelease filter (defaults to false - exclude prereleases)
    filtered = filtered.filter((rel) => rel.prerelease === prereleaseBool);
    
    // Filter by supported versions if requested
    if (supportedBool === true && supportedMinorVersions.length > 0) {
      filtered = filtered.filter((rel) => {
        const match = rel.tag.match(/^v(\d+)\.(\d+)\./);
        if (match) {
          const minorVersion = `${match[1]}.${match[2]}`;
          return supportedMinorVersions.includes(minorVersion);
        }
        return false;
      });
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
