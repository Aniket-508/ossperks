import {
  checkAllProgramsDetailed,
  fetchRepoContext,
  programs,
} from "@ossperks/core";
import type { RepoProvider } from "@ossperks/core";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import OgCheckImage from "@/components/og/og-check-image";
import OgImage from "@/components/og/og-image";
import { generateLangParams, isLocale } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { loadOgFonts, OG_DIMENSIONS } from "@/lib/og";

const VALID_PROVIDERS = new Set(["github", "gitlab", "codeberg", "gitea"]);

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ lang: string }> },
) => {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }

  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  const provider = url.searchParams.get("provider") ?? "github";

  const fonts = await loadOgFonts();

  if (!owner || !repo || !VALID_PROVIDERS.has(provider)) {
    const t = await getT(lang);
    return new ImageResponse(
      <OgImage description={t.check.description} title={t.check.heading} />,
      { ...OG_DIMENSIONS, fonts },
    );
  }

  try {
    const ctx = await fetchRepoContext({
      owner,
      path: `${owner}/${repo}`,
      provider: provider as RepoProvider,
      repo,
    });
    const results = checkAllProgramsDetailed(programs, ctx);

    const stats = { eligible: 0, ineligible: 0, needsReview: 0 };
    for (const { result } of results) {
      if (result.status === "eligible") {
        stats.eligible += 1;
      } else if (result.status === "needs-review") {
        stats.needsReview += 1;
      } else {
        stats.ineligible += 1;
      }
    }

    return new ImageResponse(
      <OgCheckImage
        description={ctx.description}
        provider={provider as RepoProvider}
        repoPath={ctx.path}
        stars={ctx.stars}
        stats={stats}
      />,
      { ...OG_DIMENSIONS, fonts },
    );
  } catch {
    const t = await getT(lang);
    return new ImageResponse(
      <OgImage description={t.check.description} title={t.check.heading} />,
      { ...OG_DIMENSIONS, fonts },
    );
  }
};

export const generateStaticParams = generateLangParams;
