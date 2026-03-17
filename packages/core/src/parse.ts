import type { RepoRef } from "./types";

const normalizeRawUrl = (raw: string): string =>
  raw
    .trim()
    .replace(/^git\+/, "")
    .replace(/\.git$/, "")
    .replace(/^git@([^:]+):/, "https://$1/");

const toUrl = (raw: string): URL | null => {
  const normalized = normalizeRawUrl(raw);
  if (!normalized) {
    return null;
  }
  try {
    return new URL(
      /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`
    );
  } catch {
    return null;
  }
};

const getPathSegments = (url: URL): string[] =>
  url.pathname.split("/").filter(Boolean);

const parseGitHub = (segments: string[]): RepoRef | null => {
  if (segments.length < 2) {
    return null;
  }
  const [owner, repo] = segments;
  return { owner, path: `${owner}/${repo}`, provider: "github", repo };
};

const parseGitLab = (segments: string[]): RepoRef | null => {
  const markerIndex = segments.indexOf("-");
  const pathSegments =
    markerIndex !== -1 ? segments.slice(0, markerIndex) : segments; // eslint-disable-line no-negated-condition
  if (pathSegments.length < 2) {
    return null;
  }
  const [owner] = pathSegments;
  const repo = pathSegments.at(-1);
  if (!repo) {
    return null;
  }
  return {
    owner,
    path: pathSegments.join("/"),
    provider: "gitlab",
    repo,
  };
};

export const parseRepoUrl = (raw: string): RepoRef | null => {
  const url = toUrl(raw);
  if (!url) {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const segments = getPathSegments(url);

  if (host === "github.com" || host === "www.github.com") {
    return parseGitHub(segments);
  }
  if (host === "gitlab.com" || host === "www.gitlab.com") {
    return parseGitLab(segments);
  }
  return null;
};
