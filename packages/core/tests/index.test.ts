import {
  aggregateDependencies,
  extractDependencyNames,
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
    expect(slugs).toHaveLength(programs.length);
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

describe(extractDependencyNames, () => {
  it("extracts from dependencies and devDependencies", () => {
    const names = extractDependencyNames({
      dependencies: { react: "^18.0.0", "react-dom": "^18.0.0" },
      devDependencies: { typescript: "^5.0.0" },
    });
    expect(names).toContain("react");
    expect(names).toContain("react-dom");
    expect(names).toContain("typescript");
  });

  it("extracts from peerDependencies and optionalDependencies", () => {
    const names = extractDependencyNames({
      optionalDependencies: { fsevents: "^2.0.0" },
      peerDependencies: { react: ">=17" },
    });
    expect(names).toContain("react");
    expect(names).toContain("fsevents");
  });

  it("deduplicates across fields", () => {
    const names = extractDependencyNames({
      dependencies: { react: "^18.0.0" },
      peerDependencies: { react: ">=17" },
    });
    expect(names.filter((n) => n === "react")).toHaveLength(1);
  });

  it("returns empty array for empty package.json", () => {
    expect(extractDependencyNames({})).toStrictEqual([]);
  });

  it("handles non-object dependency fields gracefully", () => {
    const names = extractDependencyNames({
      dependencies: "invalid",
      devDependencies: null,
    });
    expect(names).toStrictEqual([]);
  });
});

describe(aggregateDependencies, () => {
  it("merges dependencies from multiple package.json objects", () => {
    const result = aggregateDependencies([
      { dependencies: { next: "^14.0.0", react: "^18.0.0" } },
      {
        dependencies: { convex: "^1.0.0" },
        devDependencies: { vitest: "^1.0.0" },
      },
    ]);
    expect(result).toContain("react");
    expect(result).toContain("next");
    expect(result).toContain("convex");
    expect(result).toContain("vitest");
  });

  it("deduplicates across multiple package.json objects", () => {
    const result = aggregateDependencies([
      { dependencies: { react: "^18.0.0", typescript: "^5.0.0" } },
      {
        dependencies: { react: "^18.2.0" },
        devDependencies: { typescript: "^5.1.0" },
      },
      { peerDependencies: { react: ">=17" } },
    ]);
    expect(result.filter((n) => n === "react")).toHaveLength(1);
    expect(result.filter((n) => n === "typescript")).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(aggregateDependencies([])).toStrictEqual([]);
  });

  it("handles a mix of valid and empty package objects", () => {
    const result = aggregateDependencies([
      {},
      { dependencies: { pg: "^8.0.0" } },
      { devDependencies: {} },
    ]);
    expect(result).toStrictEqual(["pg"]);
  });
});
