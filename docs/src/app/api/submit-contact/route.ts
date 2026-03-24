import { Octokit } from "@octokit/rest";
import type { Contact } from "@ossperks/core";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { GITHUB_CONFIG } from "@/constants/links";
import { collapseShortArrays } from "@/lib/json";

type ContactSubmission = Pick<Contact, "name" | "url"> &
  Required<Pick<Contact, "role">> & { programSlug: string };

const buildPRBody = (
  submission: ContactSubmission,
): string => `## New Contact Submission

**Contact:** ${submission.name}
**Role:** ${submission.role}
${submission.url ? `**URL:** ${submission.url}` : ""}
**Program:** ${submission.programSlug}

---
*Submitted via the OSS Perks website.*
`;

const createContactPR = async (
  submission: ContactSubmission,
  githubToken: string,
) => {
  const octokit = new Octokit({ auth: githubToken });
  const filePath = `packages/core/src/programs/${submission.programSlug}.json`;
  const branchName = `add-contact-${submission.programSlug}-${Date.now()}`;

  const { data: ref } = await octokit.git.getRef({
    owner: GITHUB_CONFIG.user,
    ref: `heads/${GITHUB_CONFIG.branch}`,
    repo: GITHUB_CONFIG.repo,
  });

  const { data: fileData } = await octokit.repos.getContent({
    owner: GITHUB_CONFIG.user,
    path: filePath,
    repo: GITHUB_CONFIG.repo,
  });

  if (Array.isArray(fileData) || !("content" in fileData) || !fileData.sha) {
    throw new Error("Could not read program file");
  }

  const currentContent = Buffer.from(fileData.content, "base64").toString();
  const programData = JSON.parse(currentContent);

  const contact: Record<string, string> = {
    name: submission.name.trim(),
    role: submission.role.trim(),
    ...(submission.url?.trim() && { url: submission.url.trim() }),
  };
  programData.contact = contact;

  const updatedContent = collapseShortArrays(
    `${JSON.stringify(programData, null, 2)}\n`,
  );

  await octokit.git.createRef({
    owner: GITHUB_CONFIG.user,
    ref: `refs/heads/${branchName}`,
    repo: GITHUB_CONFIG.repo,
    sha: ref.object.sha,
  });

  await octokit.repos.createOrUpdateFileContents({
    branch: branchName,
    content: Buffer.from(updatedContent).toString("base64"),
    message: `feat: Add contact for ${submission.programSlug}`,
    owner: GITHUB_CONFIG.user,
    path: filePath,
    repo: GITHUB_CONFIG.repo,
    sha: fileData.sha,
  });

  const { data: pr } = await octokit.pulls.create({
    base: GITHUB_CONFIG.branch,
    body: buildPRBody(submission),
    head: branchName,
    owner: GITHUB_CONFIG.user,
    repo: GITHUB_CONFIG.repo,
    title: `feat: Add contact for ${submission.programSlug}`,
  });

  return { prNumber: pr.number, prUrl: pr.html_url };
};

export const POST = async (request: NextRequest) => {
  try {
    const submission: ContactSubmission = await request.json();

    if (!submission.name || !submission.role || !submission.programSlug) {
      return NextResponse.json(
        { error: "Name, role, and program are required" },
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

    const result = await createContactPR(submission, githubToken);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error creating PR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create pull request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
