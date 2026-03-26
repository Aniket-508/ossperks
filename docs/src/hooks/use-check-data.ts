"use client";

import { useMemo } from "react";
import useSWR from "swr";

import type { CheckTranslations } from "@/locales/en/check";
import { CheckApiErrorCode } from "@/types/check";
import type { CheckApiErrorResponse, CheckResponse } from "@/types/check";

const getErrorMessage = (
  error: CheckApiErrorResponse,
  status: number,
  t: CheckTranslations["errors"],
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

class CheckFetchError extends Error {
  status: number;
  body: CheckApiErrorResponse;

  constructor(message: string, status: number, body: CheckApiErrorResponse) {
    super(message);
    this.name = "CheckFetchError";
    this.status = status;
    this.body = body;
  }
}

const fetchCheck = async (url: string): Promise<CheckResponse> => {
  const res = await fetch(url);
  const json = (await res.json()) as CheckResponse | CheckApiErrorResponse;

  if (!res.ok) {
    throw new CheckFetchError(
      "check failed",
      res.status,
      json as CheckApiErrorResponse,
    );
  }

  return json as CheckResponse;
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
  const key = useMemo(() => {
    if (!provider || !owner || !repo) {
      return null;
    }
    return `/api/check?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&provider=${encodeURIComponent(provider)}${path ? `&path=${encodeURIComponent(path)}` : ""}`;
  }, [owner, path, provider, repo]);

  const {
    data,
    error: swrError,
    isLoading: loading,
  } = useSWR(key, fetchCheck, { revalidateOnFocus: false });

  const error = useMemo(() => {
    if (!swrError) {
      return null;
    }
    if (swrError instanceof CheckFetchError) {
      return getErrorMessage(
        swrError.body,
        swrError.status,
        translations.errors,
      );
    }
    return translations.fetchError;
  }, [swrError, translations.errors, translations.fetchError]);

  return { data, error, loading };
};
