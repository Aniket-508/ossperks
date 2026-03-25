import {
  checkAllProgramsDetailed,
  fetchRepoContext,
  programs,
  VALID_PROVIDERS,
} from "@ossperks/core";
import type { RepoProvider, RepoRef } from "@ossperks/core";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_PROVIDER } from "@/lib/check";
import { checkRateLimit } from "@/lib/rate-limit";
import { CheckApiErrorCode } from "@/types/check";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_AGE_S = Math.floor(CACHE_TTL_MS / 1000);

interface CacheEntry {
  body: Record<string, unknown>;
  cachedAt: number;
}

const responseCache = new Map<string, CacheEntry>();

const getCached = (key: string): Record<string, unknown> | null => {
  const entry = responseCache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.body;
};

const setCache = (key: string, body: Record<string, unknown>) => {
  responseCache.set(key, { body, cachedAt: Date.now() });
};

const validateParams = (searchParams: URLSearchParams) => {
  const owner = searchParams.get("owner");
  const path = searchParams.get("path");
  const repo = searchParams.get("repo");
  const provider =
    (searchParams.get("provider") as RepoProvider) ?? DEFAULT_PROVIDER;

  if (!owner || !repo) {
    return {
      error: NextResponse.json(
        {
          error: "Missing required query parameters: owner, repo",
          errorCode: CheckApiErrorCode.MissingParams,
        },
        { status: 400 },
      ),
    };
  }

  if (!VALID_PROVIDERS.has(provider)) {
    return {
      error: NextResponse.json(
        {
          error:
            'Invalid provider. Must be "github", "gitlab", "codeberg", or "gitea".',
          errorCode: CheckApiErrorCode.InvalidProvider,
        },
        { status: 400 },
      ),
    };
  }

  return {
    owner,
    path: path ?? `${owner}/${repo}`,
    provider,
    repo,
  };
};

const applyRateLimit = async () => {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  return checkRateLimit.limit(ip);
};

const cacheHeaders = (hit: boolean) => ({
  "Cache-Control": `public, max-age=${CACHE_MAX_AGE_S}, s-maxage=${CACHE_MAX_AGE_S}`,
  "X-Cache": hit ? "HIT" : "MISS",
});

const fetchAndCheck = async (ref: RepoRef) => {
  const ctx = await fetchRepoContext(ref);
  const results = checkAllProgramsDetailed(programs, ctx);

  return {
    repo: {
      description: ctx.description,
      isFork: ctx.isFork,
      isPrivate: ctx.isPrivate,
      license: ctx.license,
      name: ctx.name,
      owner: ctx.owner,
      path: ctx.path,
      provider: ctx.provider,
      pushedAt: ctx.pushedAt.toISOString(),
      repo: ctx.repo,
      stars: ctx.stars,
    },
    results: results.map(({ program, result }) => ({
      name: program.name,
      perksCount: program.perks.length,
      reasons: result.reasons,
      slug: program.slug,
      status: result.status,
    })),
  };
};

export const GET = async (req: NextRequest) => {
  const params = validateParams(req.nextUrl.searchParams);
  if ("error" in params) {
    return params.error;
  }

  const { success } = await applyRateLimit();
  if (!success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Try again in a minute.",
        errorCode: CheckApiErrorCode.RateLimit,
      },
      { status: 429 },
    );
  }

  const ref: RepoRef = {
    owner: params.owner,
    path: params.path,
    provider: params.provider,
    repo: params.repo,
  };
  const cacheKey = `${ref.provider}/${ref.path.toLowerCase()}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: cacheHeaders(true) });
  }

  try {
    const body = await fetchAndCheck(ref);
    setCache(cacheKey, body);
    return NextResponse.json(body, { headers: cacheHeaders(false) });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (/not found/i.test(message)) {
      return NextResponse.json(
        { error: message, errorCode: CheckApiErrorCode.NotFound },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        error: `Upstream API error: ${message}`,
        errorCode: CheckApiErrorCode.Upstream,
      },
      { status: 502 },
    );
  }
};
