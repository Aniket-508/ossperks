import { Gitlab } from "@gitbeaker/rest";
import { Octokit } from "@octokit/rest";

import { PROVIDER_HOSTS } from "./parse";
import type { RepoContext, RepoRef } from "./types";

const githubClient = new Octokit({
  userAgent: "ossperks-cli",
  ...(process.env.GITHUB_TOKEN ? { auth: process.env.GITHUB_TOKEN } : {}),
});

const gitlabClient = new Gitlab({
  host: "https://gitlab.com",
  ...(process.env.GITLAB_TOKEN ? { token: process.env.GITLAB_TOKEN } : {}),
});

const getErrorStatus = (error: unknown): number | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }

  return null;
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";

const throwGitHubError = (
  status: number,
  statusText: string,
  ref: RepoRef,
): never => {
  if (status === 404) {
    throw new Error(
      `Repository ${ref.path} not found on GitHub (is it public?)`,
    );
  }
  if (status === 403 && /rate limit/i.test(statusText)) {
    throw new Error(
      "GitHub API rate limit exceeded. Set GITHUB_TOKEN env var to increase the limit.",
    );
  }
  if (status === 403) {
    throw new Error(`GitHub API access forbidden: ${statusText}`);
  }
  throw new Error(`GitHub API error: ${status} ${statusText}`);
};

export const fetchGitHub = async (ref: RepoRef): Promise<RepoContext> => {
  try {
    const { data } = await githubClient.repos.get({
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      owner: ref.owner,
      repo: ref.repo,
    });
    const createdAt = new Date(data.created_at);
    const pushedAt = data.pushed_at ? new Date(data.pushed_at) : createdAt;

    return {
      createdAt,
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
      path: ref.path,
      provider: "github",
      pushedAt,
      repo: ref.repo,
      stars: data.stargazers_count,
      topics: data.topics ?? [],
    };
  } catch (error) {
    const status = getErrorStatus(error);
    if (status !== null) {
      throwGitHubError(status, getErrorMessage(error), ref);
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
};

const throwGitLabError = (
  status: number,
  statusText: string,
  ref: RepoRef,
): never => {
  if (status === 404) {
    throw new Error(`Project ${ref.path} not found on GitLab (is it public?)`);
  }
  throw new Error(`GitLab API error: ${status} ${statusText}`);
};

export const fetchGitLab = async (ref: RepoRef): Promise<RepoContext> => {
  try {
    const data = await gitlabClient.Projects.show(ref.path, {
      license: true,
    });

    return {
      createdAt: new Date(data.created_at),
      description: data.description,
      isFork: Boolean(data.forked_from_project),
      isOrgOwned: data.namespace.kind === "group",
      isPrivate: data.visibility !== "public",
      license: data.license?.key ?? null,
      name: data.name,
      owner: ref.owner,
      path: ref.path,
      provider: "gitlab",
      pushedAt: new Date(data.last_activity_at),
      repo: ref.repo,
      stars: data.star_count,
      topics: data.topics ?? [],
    };
  } catch (error) {
    const status = getErrorStatus(error);
    if (status !== null) {
      throwGitLabError(status, getErrorMessage(error), ref);
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
};

interface GiteaRepoResponse {
  created_at: string;
  description: string;
  fork: boolean;
  internal: boolean;
  name: string;
  owner: { type: string };
  private: boolean;
  stars_count: number;
  topics: string[];
  updated_at: string;
  license: { spdx_id: string } | null;
}

const throwGiteaError = (status: number, host: string, ref: RepoRef): never => {
  if (status === 404) {
    throw new Error(
      `Repository ${ref.path} not found on ${host} (is it public?)`,
    );
  }
  throw new Error(`${host} API error: ${status}`);
};

export const fetchGitea = async (ref: RepoRef): Promise<RepoContext> => {
  const host = PROVIDER_HOSTS[ref.provider];

  const url = `https://${host}/api/v1/repos/${ref.owner}/${ref.repo}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throwGiteaError(res.status, host, ref);
  }

  const data = (await res.json()) as GiteaRepoResponse;
  const createdAt = new Date(data.created_at);

  return {
    createdAt,
    description: data.description || null,
    isFork: data.fork,
    isOrgOwned: data.owner.type === "Organization",
    isPrivate: data.private,
    license:
      data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION"
        ? data.license.spdx_id
        : null,
    name: data.name,
    owner: ref.owner,
    path: ref.path,
    provider: ref.provider,
    pushedAt: new Date(data.updated_at),
    repo: ref.repo,
    stars: data.stars_count,
    topics: data.topics ?? [],
  };
};

export const fetchRepoContext = (ref: RepoRef): Promise<RepoContext> => {
  if (ref.provider === "github") {
    return fetchGitHub(ref);
  }
  if (ref.provider === "gitlab") {
    return fetchGitLab(ref);
  }
  return fetchGitea(ref);
};
