import {
  programs,
  getProgramBySlug,
  getProgramsByCategory,
  getCategories,
  programSchema,
} from "@ossperks/core";

describe("@ossperks/core", () => {
  it("exports at least 15 programs", () => {
    expect(programs.length).toBeGreaterThanOrEqual(15);
  });

  it("every program passes schema validation", () => {
    for (const program of programs) {
      expect(() => programSchema.parse(program)).not.toThrow();
    }
  });

  it("every program has a unique slug", () => {
    const slugs = programs.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
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
