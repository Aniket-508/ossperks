import { Gitlab } from "@gitbeaker/rest";
import { Octokit } from "@octokit/rest";
import { identifyLicense } from "license-similarity";

import { PROVIDER_HOSTS } from "./parse";
import type { RepoContext, RepoRef } from "./types";

const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;

export const extractDependencyNames = (
  pkg: Record<string, unknown>,
): string[] => {
  const names = new Set<string>();
  for (const field of DEP_FIELDS) {
    const deps = pkg[field];
    if (typeof deps === "object" && deps !== null) {
      for (const name of Object.keys(deps)) {
        names.add(name);
      }
    }
  }
  return [...names];
};

export const aggregateDependencies = (
  pkgs: Record<string, unknown>[],
): string[] => {
  const names = new Set<string>();
  for (const pkg of pkgs) {
    for (const name of extractDependencyNames(pkg)) {
      names.add(name);
    }
  }
  return [...names];
};

const MAX_PACKAGE_JSON_FILES = 20;

const isPackageJsonPath = (filePath: string): boolean =>
  filePath.endsWith("/package.json") || filePath === "package.json";

const isNotInNodeModules = (filePath: string): boolean =>
  !filePath.includes("node_modules");

const parseBase64Json = (content: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(
      Buffer.from(content, "base64").toString("utf8"),
    ) as Record<string, unknown>;
  } catch {
    return null;
  }
};

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

interface TreeScanResult {
  dependencies: string[];
  filePaths: string[];
}

const fetchGitHubTree = async (ref: RepoRef): Promise<TreeScanResult> => {
  try {
    const { data: tree } = await githubClient.git.getTree({
      headers: { "X-GitHub-Api-Version": "2022-11-28" },
      owner: ref.owner,
      recursive: "1",
      repo: ref.repo,
      tree_sha: "HEAD",
    });

    const filePaths = tree.tree
      .filter((entry) => entry.type === "blob" && entry.path)
      .map((entry) => entry.path as string);

    const pkgPaths = filePaths
      .filter((p) => isPackageJsonPath(p) && isNotInNodeModules(p))
      .slice(0, MAX_PACKAGE_JSON_FILES);

    if (pkgPaths.length === 0) {
      return { dependencies: [], filePaths };
    }

    const pkgs = await Promise.all(
      pkgPaths.map(async (filePath) => {
        try {
          const { data } = await githubClient.repos.getContent({
            headers: { "X-GitHub-Api-Version": "2022-11-28" },
            owner: ref.owner,
            path: filePath,
            repo: ref.repo,
          });
          if (!("content" in data) || typeof data.content !== "string") {
            return null;
          }
          return parseBase64Json(data.content);
        } catch {
          return null;
        }
      }),
    );

    return {
      dependencies: aggregateDependencies(
        pkgs.filter((pkg): pkg is Record<string, unknown> => pkg !== null),
      ),
      filePaths,
    };
  } catch {
    return { dependencies: [], filePaths: [] };
  }
};

export const fetchGitHub = async (ref: RepoRef): Promise<RepoContext> => {
  try {
    const [{ data }, treeScan] = await Promise.all([
      githubClient.repos.get({
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        owner: ref.owner,
        repo: ref.repo,
      }),
      fetchGitHubTree(ref),
    ]);
    const createdAt = new Date(data.created_at);
    const pushedAt = data.pushed_at ? new Date(data.pushed_at) : createdAt;

    return {
      createdAt,
      dependencies: treeScan.dependencies,
      description: data.description,
      filePaths: treeScan.filePaths,
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

const fetchGitLabTree = async (ref: RepoRef): Promise<TreeScanResult> => {
  try {
    const treeEntries = await gitlabClient.Repositories.allRepositoryTrees(
      ref.path,
      { recursive: true },
    );

    const filePaths = treeEntries
      .filter((entry) => entry.type === "blob")
      .map((entry) => entry.path);

    const pkgPaths = filePaths
      .filter((p) => isPackageJsonPath(p) && isNotInNodeModules(p))
      .slice(0, MAX_PACKAGE_JSON_FILES);

    if (pkgPaths.length === 0) {
      return { dependencies: [], filePaths };
    }

    const pkgs = await Promise.all(
      pkgPaths.map(async (filePath) => {
        try {
          const data = await gitlabClient.RepositoryFiles.show(
            ref.path,
            filePath,
            "HEAD",
          );
          if (typeof data.content !== "string") {
            return null;
          }
          return parseBase64Json(data.content);
        } catch {
          return null;
        }
      }),
    );

    return {
      dependencies: aggregateDependencies(
        pkgs.filter((pkg): pkg is Record<string, unknown> => pkg !== null),
      ),
      filePaths,
    };
  } catch {
    return { dependencies: [], filePaths: [] };
  }
};

export const fetchGitLab = async (ref: RepoRef): Promise<RepoContext> => {
  try {
    const [data, treeScan] = await Promise.all([
      gitlabClient.Projects.show(ref.path, { license: true }),
      fetchGitLabTree(ref),
    ]);

    return {
      createdAt: new Date(data.created_at),
      dependencies: treeScan.dependencies,
      description: data.description,
      filePaths: treeScan.filePaths,
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

const detectLicenseFromText = (text: string): string | null => {
  try {
    const result = identifyLicense(text);
    return typeof result === "string" ? result : null;
  } catch {
    return null;
  }
};

const LICENSE_FILE_NAMES = [
  "LICENSE",
  "LICENSE.md",
  "LICENSE.txt",
  "LICENCE",
  "LICENCE.md",
  "LICENCE.txt",
];

const fetchGiteaLicense = async (
  ref: RepoRef,
  host: string,
): Promise<string | null> => {
  for (const fileName of LICENSE_FILE_NAMES) {
    try {
      const url = `https://${host}/api/v1/repos/${ref.owner}/${ref.repo}/contents/${fileName}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        continue;
      }
      const file = (await res.json()) as { content?: string };
      if (!file.content) {
        continue;
      }
      const text = Buffer.from(file.content, "base64").toString("utf8");
      const spdxId = detectLicenseFromText(text);
      if (spdxId) {
        return spdxId;
      }
    } catch {
      continue;
    }
  }
  return null;
};

const throwGiteaError = (status: number, host: string, ref: RepoRef): never => {
  if (status === 404) {
    throw new Error(
      `Repository ${ref.path} not found on ${host} (is it public?)`,
    );
  }
  throw new Error(`${host} API error: ${status}`);
};

interface GiteaTreeEntry {
  path?: string;
  type?: string;
}

const fetchGiteaTree = async (
  ref: RepoRef,
  host: string,
): Promise<TreeScanResult> => {
  try {
    const treeUrl = `https://${host}/api/v1/repos/${ref.owner}/${ref.repo}/git/trees/HEAD?recursive=true`;
    const treeRes = await fetch(treeUrl, {
      headers: { Accept: "application/json" },
    });
    if (!treeRes.ok) {
      return { dependencies: [], filePaths: [] };
    }
    const treeData = (await treeRes.json()) as { tree?: GiteaTreeEntry[] };
    const entries = treeData.tree ?? [];

    const filePaths = entries
      .filter((entry) => entry.type === "blob" && entry.path)
      .map((entry) => entry.path as string);

    const pkgPaths = filePaths
      .filter((p) => isPackageJsonPath(p) && isNotInNodeModules(p))
      .slice(0, MAX_PACKAGE_JSON_FILES);

    if (pkgPaths.length === 0) {
      return { dependencies: [], filePaths };
    }

    const pkgs = await Promise.all(
      pkgPaths.map(async (filePath) => {
        try {
          const url = `https://${host}/api/v1/repos/${ref.owner}/${ref.repo}/contents/${filePath}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) {
            return null;
          }
          const file = (await res.json()) as { content?: string };
          if (!file.content) {
            return null;
          }
          return parseBase64Json(file.content);
        } catch {
          return null;
        }
      }),
    );

    return {
      dependencies: aggregateDependencies(
        pkgs.filter((pkg): pkg is Record<string, unknown> => pkg !== null),
      ),
      filePaths,
    };
  } catch {
    return { dependencies: [], filePaths: [] };
  }
};

export const fetchGitea = async (ref: RepoRef): Promise<RepoContext> => {
  const host = PROVIDER_HOSTS[ref.provider];

  const repoUrl = `https://${host}/api/v1/repos/${ref.owner}/${ref.repo}`;
  const [repoRes, treeScan] = await Promise.all([
    fetch(repoUrl, { headers: { Accept: "application/json" } }),
    fetchGiteaTree(ref, host),
  ]);

  if (!repoRes.ok) {
    throwGiteaError(repoRes.status, host, ref);
  }

  const data = (await repoRes.json()) as GiteaRepoResponse;
  const createdAt = new Date(data.created_at);

  let license: string | null =
    data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION"
      ? data.license.spdx_id
      : null;

  if (!license) {
    license = await fetchGiteaLicense(ref, host);
  }

  return {
    createdAt,
    dependencies: treeScan.dependencies,
    description: data.description || null,
    filePaths: treeScan.filePaths,
    isFork: data.fork,
    isOrgOwned: data.owner.type === "Organization",
    isPrivate: data.private,
    license,
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
