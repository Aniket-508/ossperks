import fs from "node:fs";
import path from "node:path";

export interface RepoRef {
  provider: "github" | "gitlab";
  owner: string;
  repo: string;
}

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

const extractRepoUrl = (repo: unknown): string | null => {
  if (typeof repo === "string") {
    return repo;
  }
  if (typeof repo === "object" && repo !== null && "url" in repo) {
    return String((repo as { url: string }).url);
  }
  return null;
};

const safeReadPkg = (pkgPath: string): Record<string, unknown> | null => {
  if (!fs.existsSync(pkgPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(pkgPath, "utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
};

const fromPackageJson = (cwd: string): RepoRef | null => {
  const pkg = safeReadPkg(path.join(cwd, "package.json"));
  if (!pkg) {
    return null;
  }
  const url = extractRepoUrl(pkg.repository);
  if (!url) {
    return null;
  }
  return parseRepoUrl(url);
};

const readGitRemoteUrl = (cwd: string): string | null => {
  const gitConfigPath = path.join(cwd, ".git", "config");
  if (!fs.existsSync(gitConfigPath)) {
    return null;
  }
  let content: string;
  try {
    content = fs.readFileSync(gitConfigPath, "utf8");
  } catch {
    return null;
  }
  const match = content.match(/\[remote\s+"origin"\][^[]*url\s*=\s*(.+)/);
  return match ? match[1].trim() : null;
};

const fromGitConfig = (cwd: string): RepoRef | null => {
  const remoteUrl = readGitRemoteUrl(cwd);
  if (!remoteUrl) {
    return null;
  }
  return parseRepoUrl(remoteUrl);
};

export const detectRepo = (cwd = process.cwd()): RepoRef | null =>
  fromPackageJson(cwd) ?? fromGitConfig(cwd);
