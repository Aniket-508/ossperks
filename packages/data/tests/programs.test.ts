import {
  getAllProgramSlugs,
  getProgramBySlug,
  programs,
  programSchema,
  rawPrograms,
  formatSlug,
} from "@ossperks/data";

describe("program data integrity", () => {
  it("rawPrograms length matches parsed programs", () => {
    expect(rawPrograms).toHaveLength(programs.length);
  });

  it("exports at least 15 programs", () => {
    expect(programs.length).toBeGreaterThanOrEqual(15);
  });

  it("every program passes schema validation", () => {
    for (const program of programs) {
      expect(() => programSchema.parse(program)).not.toThrow();
    }
  });

  it("every program has a unique slug", () => {
    const slugs = getAllProgramSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every program slug is canonical", () => {
    for (const program of programs) {
      expect(program.slug).toBe(formatSlug(program.slug));
    }
  });

  it("programSchema rejects non-canonical slugs", () => {
    expect(() =>
      programSchema.parse({ ...programs[0], slug: "Not Canonical" }),
    ).toThrow(/slug/i);
  });

  it("every program has at least one perk", () => {
    for (const program of programs) {
      expect(program.perks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every program has at least one eligibility criterion", () => {
    for (const program of programs) {
      expect(program.eligibility.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("programs with techPackages have valid arrays", () => {
    const withTech = programs.filter(
      (p): p is typeof p & { techPackages: string[] } =>
        Array.isArray(p.techPackages),
    );
    expect(withTech.length).toBeGreaterThanOrEqual(1);
    for (const p of withTech) {
      expect(p.techPackages.length).toBeGreaterThanOrEqual(1);
      for (const pkg of p.techPackages) {
        expectTypeOf(pkg).toBeString();
        expect(pkg.length).toBeGreaterThan(0);
      }
    }
  });
});

describe(getProgramBySlug, () => {
  it("getAllProgramSlugs returns one slug per program", () => {
    const slugs = getAllProgramSlugs();
    expect(slugs).toHaveLength(programs.length);
    expect(slugs).toContain("vercel");
    expect(slugs).toContain("github-copilot");
  });

  it("returns the correct program", () => {
    const result = getProgramBySlug("vercel");
    expect(result).toBeDefined();
    expect(result?.provider).toBe("Vercel");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProgramBySlug("nonexistent")).toBeUndefined();
  });

  it("stays strict (no case folding)", () => {
    expect(getProgramBySlug("Vercel")).toBeUndefined();
  });
});
