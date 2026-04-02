import { getCategories, getProgramsByCategory } from "@ossperks/data";

describe("categories", () => {
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
