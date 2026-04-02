/** Encode a program tag for use in a URL path segment (dynamic `[tag]`). */
export const encodeTagForPath = (tag: string): string =>
  encodeURIComponent(tag);

/** Decode a path segment from `/tags/[tag]` (safe if the segment is already decoded). */
export const decodeTagFromPath = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};
