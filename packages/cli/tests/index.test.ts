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
      provider: "github",
      repo: "next.js",
    });
  });

  it("parses git+https GitHub URL with .git suffix", () => {
    expect(parseRepoUrl("git+https://github.com/owner/repo.git")).toStrictEqual(
      {
        owner: "owner",
        provider: "github",
        repo: "repo",
      }
    );
  });

  it("parses SSH GitHub URL", () => {
    expect(parseRepoUrl("git@github.com:owner/repo.git")).toStrictEqual({
      owner: "owner",
      provider: "github",
      repo: "repo",
    });
  });

  it("parses HTTPS GitLab URL", () => {
    expect(parseRepoUrl("https://gitlab.com/user/project.git")).toStrictEqual({
      owner: "user",
      provider: "gitlab",
      repo: "project",
    });
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
