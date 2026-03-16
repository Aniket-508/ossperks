import type { RepoContext, RepoRef } from "./types";

interface GitHubRepo {
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
  description: string | null;
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
  topics: string[];
  license: { spdx_id: string } | null;
  owner: { type: string };
}

interface GitLabProject {
  name: string;
  star_count: number;
  visibility: string;
  forked_from_project?: unknown;
  description: string | null;
  created_at: string;
  last_activity_at: string;
  license?: { key: string } | null;
  namespace: { kind: string };
}

const githubHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ossperks-cli",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

const throwGitHubError = (res: Response, ref: RepoRef): never => {
  if (res.status === 404) {
    throw new Error(
      `Repository ${ref.owner}/${ref.repo} not found on GitHub (is it public?)`
    );
  }
  if (res.status === 403) {
    throw new Error(
      "GitHub API rate limit exceeded. Set GITHUB_TOKEN env var to increase the limit."
    );
  }
  throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
};

export const fetchGitHub = async (ref: RepoRef): Promise<RepoContext> => {
  const url = `https://api.github.com/repos/${ref.owner}/${ref.repo}`;
  const res = await fetch(url, { headers: githubHeaders() });

  if (!res.ok) {
    throwGitHubError(res, ref);
  }

  const data = (await res.json()) as GitHubRepo;

  return {
    createdAt: new Date(data.created_at),
    description: data.description,
    isFork: data.fork,
    isOrgOwned: data.owner.type === "Organization",
    isPrivate: data.private,
    license:
      data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION"
        ? data.license.spdx_id
        : null,
    name: data.name,
    owner: ref.owner,
    provider: "github",
    pushedAt: new Date(data.pushed_at),
    repo: ref.repo,
    stars: data.stargazers_count,
    topics: data.topics ?? [],
  };
};

const throwGitLabError = (res: Response, ref: RepoRef): never => {
  if (res.status === 404) {
    throw new Error(
      `Project ${ref.owner}/${ref.repo} not found on GitLab (is it public?)`
    );
  }
  throw new Error(`GitLab API error: ${res.status} ${res.statusText}`);
};

export const fetchGitLab = async (ref: RepoRef): Promise<RepoContext> => {
  const encoded = encodeURIComponent(`${ref.owner}/${ref.repo}`);
  const url = `https://gitlab.com/api/v4/projects/${encoded}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ossperks-cli" },
  });

  if (!res.ok) {
    throwGitLabError(res, ref);
  }

  const data = (await res.json()) as GitLabProject;

  return {
    createdAt: new Date(data.created_at),
    description: data.description,
    isFork: Boolean(data.forked_from_project),
    isOrgOwned: data.namespace.kind === "group",
    isPrivate: data.visibility !== "public",
    license: data.license?.key ?? null,
    name: data.name,
    owner: ref.owner,
    provider: "gitlab",
    pushedAt: new Date(data.last_activity_at),
    repo: ref.repo,
    stars: data.star_count,
    topics: [],
  };
};

export const fetchRepoContext = (ref: RepoRef): Promise<RepoContext> =>
  ref.provider === "github" ? fetchGitHub(ref) : fetchGitLab(ref);
