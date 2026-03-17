import {
  programs,
  getProgramBySlug,
  parseRepoUrl,
  checkEligibility,
  checkAllPrograms,
} from "@ossperks/core";
import type { RepoContext } from "@ossperks/core";

// ---------------------------------------------------------------------------
// detect — parseRepoUrl
// ---------------------------------------------------------------------------

describe("parseRepoUrl: URL detection", () => {
  it("parses HTTPS GitHub URL", () => {
    expect(parseRepoUrl("https://github.com/vercel/next.js")).toStrictEqual({
      owner: "vercel",
      path: "vercel/next.js",
      provider: "github",
      repo: "next.js",
    });
  });

  it("parses git+https GitHub URL with .git suffix", () => {
    expect(parseRepoUrl("git+https://github.com/owner/repo.git")).toStrictEqual(
      {
        owner: "owner",
        path: "owner/repo",
        provider: "github",
        repo: "repo",
      }
    );
  });

  it("parses SSH GitHub URL", () => {
    expect(parseRepoUrl("git@github.com:owner/repo.git")).toStrictEqual({
      owner: "owner",
      path: "owner/repo",
      provider: "github",
      repo: "repo",
    });
  });

  it("parses HTTPS GitLab URL", () => {
    expect(parseRepoUrl("https://gitlab.com/user/project.git")).toStrictEqual({
      owner: "user",
      path: "user/project",
      provider: "gitlab",
      repo: "project",
    });
  });

  it("parses GitLab subgroup URLs", () => {
    expect(
      parseRepoUrl("https://gitlab.com/group/subgroup/project/-/tree/main")
    ).toStrictEqual({
      owner: "group",
      path: "group/subgroup/project",
      provider: "gitlab",
      repo: "project",
    });
  });

  it("rejects malformed hosts that contain github.com as a substring", () => {
    expect(parseRepoUrl("https://notgithub.com/vercel/next.js")).toBeNull();
    expect(
      parseRepoUrl("https://example.com/path/github.com/vercel/next.js")
    ).toBeNull();
  });

  it("returns null for unknown hosts", () => {
    expect(parseRepoUrl("https://bitbucket.org/user/repo")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseRepoUrl("")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Shared RepoContext fixtures
// ---------------------------------------------------------------------------

const makeCtx = (overrides: Partial<RepoContext> = {}): RepoContext => ({
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  description: "A test library",
  isFork: false,
  isOrgOwned: false,
  isPrivate: false,
  license: "MIT",
  name: "my-lib",
  owner: "test",
  path: "test/my-lib",
  provider: "github",
  pushedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  repo: "my-lib",
  stars: 2000,
  topics: ["library", "typescript"],
  ...overrides,
});

// ---------------------------------------------------------------------------
// eligibility — checkEligibility
// ---------------------------------------------------------------------------

describe("checkEligibility: program matching", () => {
  describe("sentry (active OSS + OSI license)", () => {
    const sentry = getProgramBySlug("sentry");
    if (!sentry) {
      throw new Error("sentry test data missing");
    }

    it("passes with MIT license and recent push", () => {
      const result = checkEligibility(sentry, makeCtx());
      expect(result.status).toBe("eligible");
    });

    it("fails with no license", () => {
      const result = checkEligibility(sentry, makeCtx({ license: null }));
      expect(result.status).toBe("ineligible");
      expect(result.reasons[0]).toMatch(/license/i);
    });

    it("fails when repo is inactive (>180 days)", () => {
      const result = checkEligibility(
        sentry,
        makeCtx({
          pushedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        })
      );
      expect(result.status).toBe("ineligible");
    });
  });

  describe("gitlab (OSS + public)", () => {
    const gitlab = getProgramBySlug("gitlab");
    if (!gitlab) {
      throw new Error("gitlab test data missing");
    }

    it("passes for public OSS repo (not ineligible)", () => {
      const result = checkEligibility(gitlab, makeCtx());
      expect(["eligible", "needs-review"]).toContain(result.status);
    });

    it("fails for private repo", () => {
      const result = checkEligibility(gitlab, makeCtx({ isPrivate: true }));
      expect(result.status).toBe("ineligible");
      expect(result.reasons[0]).toMatch(/private/i);
    });
  });

  describe("provider alternatives and mixed rules", () => {
    const sourcery = getProgramBySlug("sourcery");
    const anthropic = getProgramBySlug("anthropic-claude");
    const chromatic = getProgramBySlug("chromatic");
    const circleci = getProgramBySlug("circleci");

    if (!sourcery || !anthropic || !chromatic || !circleci) {
      throw new Error("test data missing for provider/threshold cases");
    }

    it("does not fail GitHub-or-GitLab rules for GitHub repos", () => {
      const result = checkEligibility(
        sourcery,
        makeCtx({ provider: "github" })
      );
      expect(result.status).not.toBe("ineligible");
    });

    it("does not fail GitHub-or-GitLab rules for GitLab repos", () => {
      const result = checkEligibility(
        sourcery,
        makeCtx({
          license: "mit",
          owner: "group",
          path: "group/subgroup/project",
          provider: "gitlab",
          repo: "project",
        })
      );
      expect(result.status).not.toBe("ineligible");
    });

    it("fails hard requirements even when a rule also has subjective criteria", () => {
      const result = checkEligibility(anthropic, makeCtx({ isPrivate: true }));
      expect(result.status).toBe("ineligible");
      expect(
        result.reasons.some((reason) => /private|public/i.test(reason))
      ).toBe(true);
    });

    it("keeps alternative threshold rules reviewable instead of ineligible", () => {
      const result = checkEligibility(chromatic, makeCtx({ stars: 100 }));
      expect(result.status).toBe("needs-review");
    });

    it("matches public-repo wording variants", () => {
      const result = checkEligibility(circleci, makeCtx({ isPrivate: true }));
      expect(result.status).toBe("ineligible");
      expect(result.reasons[0]).toMatch(/private/i);
    });
  });

  describe("license normalization", () => {
    const sentry = getProgramBySlug("sentry");
    if (!sentry) {
      throw new Error("sentry test data missing");
    }

    it("accepts lowercase GitLab license identifiers", () => {
      const result = checkEligibility(
        sentry,
        makeCtx({
          license: "mit",
          owner: "group",
          path: "group/project",
          provider: "gitlab",
          repo: "project",
        })
      );
      expect(result.status).toBe("eligible");
    });
  });

  describe("1password (permissive license + age)", () => {
    const onepassword = getProgramBySlug("1password");
    if (!onepassword) {
      throw new Error("1password test data missing");
    }

    it("passes with MIT license and 1-year-old repo", () => {
      const result = checkEligibility(onepassword, makeCtx());
      expect(["eligible", "needs-review"]).toContain(result.status);
    });

    it("fails with AGPL-3.0 (non-permissive) license", () => {
      const result = checkEligibility(
        onepassword,
        makeCtx({ license: "AGPL-3.0" })
      );
      expect(result.status).toBe("ineligible");
      expect(result.reasons[0]).toMatch(/permissive/i);
    });

    it("fails for a repo younger than 30 days", () => {
      const result = checkEligibility(
        onepassword,
        makeCtx({
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        })
      );
      expect(result.status).toBe("ineligible");
      expect(result.reasons[0]).toMatch(/30 days old/i);
    });
  });

  describe("cloudflare (non-profit requirement)", () => {
    const cloudflare = getProgramBySlug("cloudflare");
    if (!cloudflare) {
      throw new Error("cloudflare test data missing");
    }

    it("returns needs-review due to non-profit clause (even with MIT license)", () => {
      const result = checkEligibility(cloudflare, makeCtx());
      expect(result.status).toBe("needs-review");
      expect(
        result.reasons.some((r) =>
          /non[\s-]?commercial|non[\s-]?profit/i.test(r)
        )
      ).toBeTruthy();
    });
  });

  describe("vercel (multiple needs-review criteria)", () => {
    const vercel = getProgramBySlug("vercel");
    if (!vercel) {
      throw new Error("vercel test data missing");
    }

    it("marks needs-review for subjective criteria", () => {
      const result = checkEligibility(vercel, makeCtx());
      expect(result.status).toBe("needs-review");
    });
  });

  describe("github-copilot (GitHub-specific)", () => {
    const copilot = getProgramBySlug("github-copilot");
    if (!copilot) {
      throw new Error("github-copilot test data missing");
    }

    it("passes provider check for github repos", () => {
      const result = checkEligibility(copilot, makeCtx({ provider: "github" }));
      expect(result.status).not.toBe("ineligible");
    });
  });
});

// ---------------------------------------------------------------------------
// eligibility — checkAllPrograms
// ---------------------------------------------------------------------------

describe("checkAllPrograms: full results", () => {
  it("returns a result for every program", () => {
    const ctx = makeCtx();
    const results = checkAllPrograms(programs, ctx);
    expect(results).toHaveLength(programs.length);
  });

  it("places eligible programs before ineligible ones", () => {
    const ctx = makeCtx();
    const results = checkAllPrograms(programs, ctx);
    const statuses = results.map((r) => r.result.status);
    const eligibleCount = statuses.filter((s) => s === "eligible").length;
    for (let i = 0; i < eligibleCount; i += 1) {
      expect(statuses[i]).toBe("eligible");
    }
    for (let i = eligibleCount; i < statuses.length; i += 1) {
      expect(statuses[i]).not.toBe("eligible");
    }
  });

  it("detects ineligibility for private repo", () => {
    const ctx = makeCtx({ isPrivate: true, license: null });
    const results = checkAllPrograms(programs, ctx);
    const ineligible = results.filter((r) => r.result.status === "ineligible");
    expect(ineligible.length).toBeGreaterThan(0);
  });
});
