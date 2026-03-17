import {
  getAllPeopleSlugs,
  programs,
  getPeople,
  getPersonBySlug,
  getProgramBySlug,
  getAllProgramSlugs,
  getProgramsByCategory,
  getCategories,
  formatSlug,
  programSchema,
} from "@ossperks/core";

describe("@ossperks/core", () => {
  it("formatSlug normalizes to lowercase hyphenated slug", () => {
    expect(formatSlug("Foo Bar")).toBe("foo-bar");
    expect(formatSlug("  Peer  Richelsen  ")).toBe("peer-richelsen");
  });

  it("formatSlug strips non-alphanumeric chars except hyphen", () => {
    expect(formatSlug("GitHub Copilot!")).toBe("github-copilot");
  });

  it("getAllProgramSlugs returns one slug per program", () => {
    const slugs = getAllProgramSlugs();
    expect(slugs.length).toBe(programs.length);
    expect(slugs).toContain("vercel");
    expect(slugs).toContain("github-copilot");
  });

  it("getProgramBySlug stays strict", () => {
    expect(getProgramBySlug("Vercel")).toBeUndefined();
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
      programSchema.parse({ ...programs[0], slug: "Not Canonical" })
    ).toThrow();
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

  it("getProgramBySlug returns the correct program", () => {
    const result = getProgramBySlug("vercel");
    expect(result).toBeDefined();
    expect(result?.provider).toBe("Vercel");
  });

  it("getProgramBySlug returns undefined for unknown slug", () => {
    expect(getProgramBySlug("nonexistent")).toBeUndefined();
  });

  it("people helpers stay in sync", () => {
    const people = getPeople();
    const slugs = getAllPeopleSlugs();

    expect(people.length).toBeGreaterThan(0);
    expect(slugs).toHaveLength(people.length);

    const [firstSlug] = slugs;
    const person = getPersonBySlug(firstSlug);
    expect(person?.slug).toBe(firstSlug);
    expect(person?.programs.length).toBeGreaterThan(0);
  });

  it("getProgramsByCategory returns only matching programs", () => {
    const aiPrograms = getProgramsByCategory("ai");
    expect(aiPrograms.length).toBeGreaterThanOrEqual(1);
    for (const p of aiPrograms) {
      expect(p.category).toBe("ai");
    }
  });

  it("getCategories returns unique sorted categories", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(1);
    const sorted = [...categories].toSorted();
    expect(categories).toStrictEqual(sorted);
  });
});
