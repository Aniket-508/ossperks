import { getAllPeopleSlugs, getPeople, getPersonBySlug } from "@ossperks/data";

describe("people helpers", () => {
  it("getPeople returns at least one person", () => {
    const people = getPeople();
    expect(people.length).toBeGreaterThan(0);
  });

  it("getAllPeopleSlugs matches getPeople length", () => {
    const people = getPeople();
    const slugs = getAllPeopleSlugs();
    expect(slugs).toHaveLength(people.length);
  });

  it("getPersonBySlug resolves the first slug", () => {
    const [firstSlug] = getAllPeopleSlugs();
    const person = getPersonBySlug(firstSlug);
    expect(person?.slug).toBe(firstSlug);
    expect(person?.programs.length).toBeGreaterThan(0);
  });
});
