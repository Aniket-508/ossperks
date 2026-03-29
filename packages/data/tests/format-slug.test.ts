import { formatSlug } from "@ossperks/data";

describe(formatSlug, () => {
  it("normalizes to lowercase hyphenated slug", () => {
    expect(formatSlug("Foo Bar")).toBe("foo-bar");
    expect(formatSlug("  Peer  Richelsen  ")).toBe("peer-richelsen");
  });

  it("strips non-alphanumeric chars except hyphen", () => {
    expect(formatSlug("GitHub Copilot!")).toBe("github-copilot");
  });
});
