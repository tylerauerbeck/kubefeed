#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import { writeFileSync } from "fs";
import { join } from "path";

// Read token from environment
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("Error: GITHUB_TOKEN environment variable not set.");
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

async function listAllReleases(owner: string, repo: string) {
  const releases: any[] = [];
  let page = 1;
  const per_page = 100;

  while (true) {
    const response = await octokit.repos.listReleases({
      owner,
      repo,
      per_page,
      page,
    });

    releases.push(...response.data);

    if (response.data.length < per_page) break; // Last page reached
    page += 1;
  }

  return releases;
}

async function main() {
  try {
    const releases = await listAllReleases("kubernetes", "kubernetes");
    const releasesArray = releases.map((release: any) => ({
      name: release.name,
      tag: release.tag_name,
      published_date: release.published_at,
      url: release.html_url,
      draft: release.draft,
      prerelease: release.prerelease,
      release_notes: release.body,
    }));

    const output = {
      releases: releasesArray,
      count: releasesArray.length,
      last_updated: new Date().toISOString()
    };

    const filePath = "../server/data/kubernetes-releases.json";
    writeFileSync(filePath, JSON.stringify(output, null, 2), "utf8");

    console.log(`Wrote ${output.count} releases to ${filePath}. Last updated: ${output.last_updated}`);
  } catch (error) {
    console.error("Failed to fetch or write releases:", error);
    process.exit(1);
  }
}

main();
