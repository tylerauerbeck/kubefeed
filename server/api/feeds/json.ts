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

function parseVersion(tag: string): { major: number; minor: number; patch: number } | null {
  const match = tag.match(/^v(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function getLatestReleases(releases: Release[], includePrerelease: boolean): Release[] {
  // Group releases by minor version and type (stable vs prerelease)
  const grouped = new Map<string, { stable: Release[]; prerelease: Release[] }>();
  
  releases.forEach((rel) => {
    const version = parseVersion(rel.tag);
    if (!version) return;
    
    const minorKey = `${version.major}.${version.minor}`;
    if (!grouped.has(minorKey)) {
      grouped.set(minorKey, { stable: [], prerelease: [] });
    }
    
    const group = grouped.get(minorKey)!;
    if (rel.prerelease) {
      group.prerelease.push(rel);
    } else {
      group.stable.push(rel);
    }
  });
  
  const result: Release[] = [];
  
  // For each minor version, get the latest release(s)
  grouped.forEach((group) => {
    // Sort by patch version descending
    const sortByPatch = (a: Release, b: Release): number => {
      const aVer = parseVersion(a.tag);
      const bVer = parseVersion(b.tag);
      if (!aVer || !bVer) return 0;
      return bVer.patch - aVer.patch;
    };
    
    // Always add the latest stable release if it exists
    if (group.stable.length > 0) {
      group.stable.sort(sortByPatch);
      result.push(group.stable[0]);
    }
    
    // If prerelease flag is true, also add the latest prerelease
    if (includePrerelease && group.prerelease.length > 0) {
      group.prerelease.sort(sortByPatch);
      result.push(group.prerelease[0]);
    }
  });
  
  return result;
}

export default defineEventHandler((event: H3Event) => {
  try {
    const { draft, prerelease, notes, tag, supported, before, after, latest } = getQuery(event);

    // Parse boolean parameters
    const draftBool = parseBooleanParam(draft);
    const prereleaseBool = parseBooleanParam(prerelease);
    const notesBool = parseBooleanParam(notes);
    const supportedBool = parseBooleanParam(supported);
    const latestBool = parseBooleanParam(latest);

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
    if (latest !== undefined && latestBool === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid value for query parameter 'latest': must be 'true' or 'false'.",
      });
    }

    // Parse and validate date parameters
    let afterDate: Date | null = null;
    let beforeDate: Date | null = null;

    if (after !== undefined) {
      afterDate = parseDateParam(after);
      if (afterDate === null) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid value for query parameter 'after': must be in YYYYMMDD format.",
        });
      }
    }

    if (before !== undefined) {
      beforeDate = parseDateParam(before);
      if (beforeDate === null) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid value for query parameter 'before': must be in YYYYMMDD format.",
        });
      }
    }

    // Validate that before date is after after date if both are provided
    if (afterDate && beforeDate && beforeDate <= afterDate) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid date range: 'before' date must be later than 'after' date.",
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
    if (afterDate || beforeDate) {
      filtered = filtered.filter((rel) => {
        const publishedDate = new Date(rel.published_date);
        
        // If only after date is provided, return releases after that date
        if (afterDate && !beforeDate) {
          return publishedDate >= afterDate;
        }
        
        // If only before date is provided, return releases before that date
        if (!afterDate && beforeDate) {
          return publishedDate <= beforeDate;
        }
        
        // If both are provided, return releases within the range
        if (afterDate && beforeDate) {
          return publishedDate >= afterDate && publishedDate <= beforeDate;
        }
        
        return true;
      });
    }

    // Apply latest filter if requested
    if (latestBool === true) {
      filtered = getLatestReleases(filtered, prereleaseBool === true);
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
