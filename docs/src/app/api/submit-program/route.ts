import { Octokit } from "@octokit/rest";
import type { Program } from "@ossperks/core";
import { formatSlug } from "@ossperks/core";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GITHUB_CONFIG } from "@/constants/links";
import { collapseShortArrays } from "@/lib/json";

interface SubmissionContact {
  name: string;
  role: string;
  url?: string;
}

type ProgramSubmission = Omit<
  Program,
  "slug" | "contact" | "duration" | "requirements"
> & {
  contact?: SubmissionContact;
};

const buildProgramJson = (
  submission: ProgramSubmission,
  slug: string,
): string => {
  const eligibility = submission.eligibility
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const applicationProcess = (submission.applicationProcess ?? [])
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const perks = submission.perks.filter(
    (p) => p.title.trim().length > 0 && p.description.trim().length > 0,
  );
  const tags =
    submission.tags && submission.tags.length > 0
      ? submission.tags
      : ["open-source"];

  const contact = submission.contact?.name?.trim()
    ? {
        name: submission.contact.name.trim(),
        role: submission.contact.role.trim(),
        ...(submission.contact.url?.trim() && {
          url: submission.contact.url.trim(),
        }),
      }
    : undefined;

  const program: Record<string, unknown> = {
    ...(applicationProcess.length > 0 && { applicationProcess }),
    ...(submission.applicationUrl?.trim() && {
      applicationUrl: submission.applicationUrl.trim(),
    }),
    category: submission.category,
    ...(contact && { contact }),
    description: submission.description,
    eligibility,
    name: submission.name,
    perks,
    provider: submission.provider,
    slug,
    tags,
    url: submission.url,
  };

  const keyOrder = [
    "slug",
    "name",
    "provider",
    "url",
    "applicationUrl",
    "category",
    "contact",
    "title",
    "description",
    "perks",
    "eligibility",
    "applicationProcess",
    "tags",
  ];
  return collapseShortArrays(`${JSON.stringify(program, keyOrder, 2)}\n`);
};

const buildPRBody = (submission: ProgramSubmission): string => {
  const eligibilityList =
    submission.eligibility.length > 0
      ? submission.eligibility
          .filter((s) => s.trim().length > 0)
          .map((s) => `- ${s}`)
          .join("\n")
      : "- (none)";
  const perksList = submission.perks
    .filter((p) => p.title.trim().length > 0 && p.description.trim().length > 0)
    .map((p) => `- **${p.title}**: ${p.description}`)
    .join("\n");
  const applicationProcessList = (submission.applicationProcess ?? [])
    .filter((s) => s.trim().length > 0)
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n");
  const tags =
    submission.tags && submission.tags.length > 0
      ? submission.tags.map((t) => `\`${t}\``).join(", ")
      : "(none)";

  return `## New Program Submission

**Program:** ${submission.name}
**Provider:** ${submission.provider}
**Category:** ${submission.category}
**URL:** ${submission.url}
**Tags:** ${tags}

### Description
${submission.description}

### Eligibility
${eligibilityList}
${applicationProcessList ? `\n### How to Apply\n${applicationProcessList}` : ""}

### Perks
${perksList || "- (none)"}
${submission.contact?.name?.trim() ? `\n### Contact\n**Name:** ${submission.contact.name}\n**Role:** ${submission.contact.role}${submission.contact.url ? `\n**URL:** ${submission.contact.url}` : ""}` : ""}

---
*Submitted via the OSS Perks website.*
`;
};

const createProgramPR = async (
  submission: ProgramSubmission,
  githubToken: string,
) => {
  const octokit = new Octokit({ auth: githubToken });
  const slug = formatSlug(submission.name);
  const jsonPath = `packages/core/src/programs/${slug}.json`;
  const branchName = `add-program-${slug}-${Date.now()}`;

  const { data: ref } = await octokit.git.getRef({
    owner: GITHUB_CONFIG.user,
    ref: `heads/${GITHUB_CONFIG.branch}`,
    repo: GITHUB_CONFIG.repo,
  });

  await octokit.git.createRef({
    owner: GITHUB_CONFIG.user,
    ref: `refs/heads/${branchName}`,
    repo: GITHUB_CONFIG.repo,
    sha: ref.object.sha,
  });

  const content = buildProgramJson(submission, slug);

  await octokit.repos.createOrUpdateFileContents({
    branch: branchName,
    content: Buffer.from(content).toString("base64"),
    message: `feat: Add ${submission.name} program`,
    owner: GITHUB_CONFIG.user,
    path: jsonPath,
    repo: GITHUB_CONFIG.repo,
  });

  const { data: pr } = await octokit.pulls.create({
    base: GITHUB_CONFIG.branch,
    body: buildPRBody(submission),
    head: branchName,
    owner: GITHUB_CONFIG.user,
    repo: GITHUB_CONFIG.repo,
    title: `feat: Add ${submission.name}`,
  });

  return { prNumber: pr.number, prUrl: pr.html_url };
};

export const POST = async (request: NextRequest) => {
  try {
    const submission: ProgramSubmission = await request.json();

    const eligibility = Array.isArray(submission.eligibility)
      ? submission.eligibility
      : [];
    const perks = Array.isArray(submission.perks) ? submission.perks : [];
    const hasEligibility = eligibility.some((s) => String(s).trim().length > 0);
    const hasPerks = perks.some(
      (p) =>
        p &&
        typeof p === "object" &&
        String(p.title).trim().length > 0 &&
        String(p.description).trim().length > 0,
    );

    if (
      !submission.name ||
      !submission.provider ||
      !submission.url ||
      !submission.category ||
      !submission.description
    ) {
      return NextResponse.json(
        {
          error: "Name, provider, URL, category, and description are required",
        },
        { status: 400 },
      );
    }
    if (!hasEligibility) {
      return NextResponse.json(
        { error: "At least one eligibility item is required" },
        { status: 400 },
      );
    }
    if (!hasPerks) {
      return NextResponse.json(
        { error: "At least one perk with title and description is required" },
        { status: 400 },
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const result = await createProgramPR(submission, githubToken);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error creating PR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create pull request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
