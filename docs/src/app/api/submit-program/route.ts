import { Octokit } from "@octokit/rest";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GITHUB_CONFIG } from "@/constants/links";

interface ProgramSubmission {
  name: string;
  provider: string;
  url: string;
  category: string;
  description: string;
  perkTitle: string;
  perkDescription: string;
}

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "");

const buildProgramJson = (
  submission: ProgramSubmission,
  slug: string
): string => {
  const program = {
    category: submission.category,
    description: submission.description,
    eligibility: ["Open-source projects"],
    name: submission.name,
    perks: [
      {
        description: submission.perkDescription,
        title: submission.perkTitle,
      },
    ],
    provider: submission.provider,
    slug,
    tags: ["open-source"],
    url: submission.url,
  };
  return `${JSON.stringify(program, null, 2)}\n`;
};

const buildPRBody = (
  submission: ProgramSubmission
): string => `## New Program Submission

**Program:** ${submission.name}
**Provider:** ${submission.provider}
**Category:** ${submission.category}
**URL:** ${submission.url}

### Description
${submission.description}

### Perks
- **${submission.perkTitle}**: ${submission.perkDescription}

---
*Submitted via the OSS Perks website.*
`;

const createProgramPR = async (
  submission: ProgramSubmission,
  githubToken: string
) => {
  const octokit = new Octokit({ auth: githubToken });
  const slug = slugify(submission.name);
  const filePath = `packages/data/src/programs/${slug}.json`;
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
    path: filePath,
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

    if (
      !submission.name ||
      !submission.provider ||
      !submission.url ||
      !submission.category ||
      !submission.description ||
      !submission.perkTitle ||
      !submission.perkDescription
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
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
