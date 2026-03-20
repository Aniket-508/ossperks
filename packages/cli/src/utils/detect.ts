import fs from "node:fs";
import path from "node:path";

import { aggregateDependencies, parseRepoUrl } from "@ossperks/core";
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

const MAX_PACKAGE_JSON_FILES = 20;

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "out",
  ".cache",
]);

const findRepoRoot = (cwd: string): string => {
  let dir = path.resolve(cwd);
  while (true) {
    if (fs.existsSync(path.join(dir, ".git"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return cwd;
    }
    dir = parent;
  }
};

const collectPackageJsonPaths = (
  rootDir: string,
  collected: string[] = [],
): string[] => {
  if (collected.length >= MAX_PACKAGE_JSON_FILES) {
    return collected;
  }

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(rootDir, { withFileTypes: true });
  } catch {
    return collected;
  }

  for (const entry of entries) {
    if (collected.length >= MAX_PACKAGE_JSON_FILES) {
      break;
    }
    if (entry.isFile() && entry.name === "package.json") {
      collected.push(path.join(rootDir, entry.name));
    } else if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
      collectPackageJsonPaths(path.join(rootDir, entry.name), collected);
    }
  }

  return collected;
};

export const detectDependencies = (cwd = process.cwd()): string[] => {
  const repoRoot = findRepoRoot(cwd);
  const pkgPaths = collectPackageJsonPaths(repoRoot);

  if (pkgPaths.length === 0) {
    return [];
  }

  const pkgs = pkgPaths
    .map((p) => safeReadPkg(p))
    .filter((pkg): pkg is Record<string, unknown> => pkg !== null);

  return aggregateDependencies(pkgs);
};
