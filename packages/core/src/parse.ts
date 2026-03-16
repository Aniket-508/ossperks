import type { RepoRef } from "./types";

export const parseRepoUrl = (raw: string): RepoRef | null => {
  const url = raw
    .trim()
    .replace(/^git\+/, "")
    .replace(/\.git$/, "")
    .replace(/^git@([^:]+):/, "https://$1/");

  const githubMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/?\s]+)/
  );
  if (githubMatch) {
    return { owner: githubMatch[1], provider: "github", repo: githubMatch[2] };
  }

  const gitlabMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^/]+)\/([^/?\s]+)/
  );
  if (gitlabMatch) {
    return { owner: gitlabMatch[1], provider: "gitlab", repo: gitlabMatch[2] };
  }

  return null;
};
