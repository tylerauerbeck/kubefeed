import { H3Event, createError, getQuery } from "h3";
import releasesData from "~/server/data/kubernetes-releases.json";

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

function parseDateParam(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  
  // Validate YYYYMMDD format
  const dateRegex = /^(\d{4})(\d{2})(\d{2})$/;
  const match = value.match(dateRegex);
  
  if (!match) return null;
  
  const [, year, month, day] = match;
  // Convert YYYYMMDD to ISO format with time set to 00:00:00Z
  const isoDate = `${year}-${month}-${day}T00:00:00Z`;
  const date = new Date(isoDate);
  
  // Validate that the date is valid
  if (isNaN(date.getTime())) return null;
  
  return date;
}

export default defineEventHandler((event: H3Event) => {
  try {
    const { draft, prerelease, notes, tag, supported, start, end } = getQuery(event);

    // Parse boolean parameters
    const draftBool = parseBooleanParam(draft);
    const prereleaseBool = parseBooleanParam(prerelease);
    const notesBool = parseBooleanParam(notes);
    const supportedBool = parseBooleanParam(supported);

    // Validate draft parameter if provided
    if (draft !== undefined && draftBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'draft': must be 'true' or 'false'.",
      });
    }
    // Validate prerelease parameter if provided
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
    if (supported !== undefined && supportedBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'supported': must be 'true' or 'false'.",
      });
    }

    // Parse and validate date parameters
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (start !== undefined) {
      startDate = parseDateParam(start);
      if (startDate === null) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid value for query parameter 'start': must be in YYYYMMDD format.",
        });
      }
    }

    if (end !== undefined) {
      endDate = parseDateParam(end);
      if (endDate === null) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid value for query parameter 'end': must be in YYYYMMDD format.",
        });
      }
    }

    // Validate that end date is after start date if both are provided
    if (startDate && endDate && endDate <= startDate) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid date range: 'end' date must be later than 'start' date.",
      });
    }

    const fileData: ReleasesFile = releasesData as ReleasesFile;

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

    // Apply additive filtering for draft and prerelease
    // Always include stable releases, optionally add drafts and/or prereleases
    filtered = filtered.filter((rel) => {
      const isStable = !rel.draft && !rel.prerelease;
      const includeDraft = draftBool === true && rel.draft;
      const includePrerelease = prereleaseBool === true && rel.prerelease;
      
      return isStable || includeDraft || includePrerelease;
    });
    
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

    // Filter by date range if provided
    if (startDate || endDate) {
      filtered = filtered.filter((rel) => {
        const publishedDate = new Date(rel.published_date);
        
        // If only start date is provided, return releases after that date
        if (startDate && !endDate) {
          return publishedDate >= startDate;
        }
        
        // If only end date is provided, return releases before that date
        if (!startDate && endDate) {
          return publishedDate <= endDate;
        }
        
        // If both are provided, return releases within the range
        if (startDate && endDate) {
          return publishedDate >= startDate && publishedDate <= endDate;
        }
        
        return true;
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
