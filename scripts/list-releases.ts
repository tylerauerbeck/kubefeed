import { Octokit } from "@octokit/rest";

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
    console.log(`# Releases for kubernetes/kubernetes`);
    for (const release of releases) {
      const {
        tag_name,
        name,
        published_at,
        html_url,
        draft,
        prerelease,
      } = release;

      console.log(`- ${tag_name} (${name || "no name"})
  Published: ${published_at}
  URL: ${html_url}
  Draft: ${draft}
  Prerelease: ${prerelease}
`);
    }
    console.log(`\nTotal releases found: ${releases.length}`);
  } catch (error) {
    console.error("Failed to fetch releases:", error);
    process.exit(1);
  }
}

main();
