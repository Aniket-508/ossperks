export const encodeUrlForPath = (url: string): string =>
  encodeURIComponent(url);

export const decodeUrlFromPath = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};
