import { checkAllPrograms, fetchRepoContext, programs } from "@ossperks/core";
import type { RepoRef } from "@ossperks/core";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";

const VALID_PROVIDERS = new Set(["github", "gitlab"]);

const validateParams = (searchParams: URLSearchParams) => {
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const provider = searchParams.get("provider") ?? "github";

  if (!owner || !repo) {
    return {
      error: NextResponse.json(
        { error: "Missing required query parameters: owner, repo" },
        { status: 400 }
      ),
    };
  }

  if (!VALID_PROVIDERS.has(provider)) {
    return {
      error: NextResponse.json(
        { error: 'Invalid provider. Must be "github" or "gitlab".' },
        { status: 400 }
      ),
    };
  }

  return { owner, provider: provider as "github" | "gitlab", repo };
};

const applyRateLimit = async () => {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  return checkRateLimit.limit(ip);
};

export const GET = async (req: NextRequest) => {
  const params = validateParams(req.nextUrl.searchParams);
  if ("error" in params) {
    return params.error;
  }

  const { success } = await applyRateLimit();
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  const ref: RepoRef = {
    owner: params.owner,
    provider: params.provider,
    repo: params.repo,
  };

  try {
    const ctx = await fetchRepoContext(ref);
    const results = checkAllPrograms(programs, ctx);

    return NextResponse.json({
      repo: {
        description: ctx.description,
        isFork: ctx.isFork,
        isPrivate: ctx.isPrivate,
        license: ctx.license,
        name: ctx.name,
        owner: ctx.owner,
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(
      { error: `Upstream API error: ${message}` },
      { status: 502 }
    );
  }
};
