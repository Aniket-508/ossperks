const JINA_BASE = "https://r.jina.ai/";
const TIMEOUT_MS = 15_000;
const DEFAULT_MAX_CHARS = 30_000;

export const fetchPageContent = async (
  url: string,
  maxChars = DEFAULT_MAX_CHARS,
): Promise<string> => {
  const headers: Record<string, string> = { Accept: "text/markdown" };
  if (process.env.JINA_API_KEY) {
    headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
  }

  const res = await fetch(`${JINA_BASE}${url}`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch page (${res.status})`);
  }

  const markdown = await res.text();
  return markdown.slice(0, maxChars);
};
