import fs from "node:fs";
import path from "node:path";

import { parseRepoUrl } from "@ossperks/core";
import type { RepoRef } from "@ossperks/core";

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
