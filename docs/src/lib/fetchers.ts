export const postJson = async <T = Record<string, unknown>>(
  url: string,
  body: unknown,
  fallbackError: string,
): Promise<T> => {
  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error((result as { error?: string }).error || fallbackError);
  }

  return result as T;
};
