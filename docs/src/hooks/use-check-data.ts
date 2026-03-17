"use client";

import { useEffect, useState } from "react";

import type { CheckTranslations } from "@/locales/en/check";
import { CheckApiErrorCode } from "@/types/check";
import type { CheckApiErrorResponse, CheckResponse } from "@/types/check";

const getErrorMessage = (
  error: CheckApiErrorResponse,
  status: number,
  t: CheckTranslations["errors"]
) => {
  if (
    error.errorCode === CheckApiErrorCode.InvalidProvider ||
    error.errorCode === CheckApiErrorCode.MissingParams
  ) {
    return t.invalidRequest;
  }
  if (error.errorCode === CheckApiErrorCode.NotFound || status === 404) {
    return t.notFound;
  }
  if (error.errorCode === CheckApiErrorCode.RateLimit || status === 429) {
    return t.rateLimit;
  }
  if (error.errorCode === CheckApiErrorCode.Upstream || status === 502) {
    return t.upstream;
  }
  return t.unknown;
};

interface UseCheckDataProps {
  owner: string | null;
  path?: string | null;
  provider: string | null;
  repo: string | null;
  translations: CheckTranslations;
}

export const useCheckData = ({
  owner,
  path,
  provider,
  repo,
  translations,
}: UseCheckDataProps) => {
  const [data, setData] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider || !owner || !repo) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setData(null);
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    let cancelled = false;

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `/api/check?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&provider=${encodeURIComponent(provider)}${
            path ? `&path=${encodeURIComponent(path)}` : ""
          }`,
          { signal: controller.signal }
        );
        const json = (await res.json()) as
          | CheckResponse
          | CheckApiErrorResponse;
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setError(
            getErrorMessage(
              json as CheckApiErrorResponse,
              res.status,
              translations.errors
            )
          );
          return;
        }
        setData(json as CheckResponse);
      } catch (fetchError) {
        if (
          cancelled ||
          (fetchError instanceof Error && fetchError.name === "AbortError")
        ) {
          return;
        }
        setError(translations.fetchError);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    owner,
    path,
    provider,
    repo,
    translations.errors,
    translations.fetchError,
  ]);

  return { data, error, loading };
};
