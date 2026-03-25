import { CATEGORY_LABELS } from "@ossperks/core/schema";
import { generateText, Output } from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchPageContent } from "@/lib/fetch-page-content";

const autofillSchema = z.object({
  applicationProcess: z
    .array(z.string())
    .describe("Steps to apply for this program"),
  applicationUrl: z
    .string()
    .nullable()
    .describe(
      "Direct application URL if different from the main program page, otherwise null",
    ),
  category: z
    .string()
    .describe("One of the valid category slugs listed in the system prompt"),
  description: z
    .string()
    .describe("One-sentence description of what the program offers"),
  eligibility: z.array(z.string()).describe("List of eligibility requirements"),
  name: z.string().describe("Official program name"),
  perks: z
    .array(
      z.object({
        description: z.string().describe("What the perk provides"),
        title: z.string().describe("Short perk title"),
      }),
    )
    .describe("List of perks/benefits offered"),
  provider: z.string().describe("Company or organization behind the program"),
  tags: z
    .array(z.string())
    .describe(
      "Lowercase kebab-case tags describing the program (e.g. cloud, credits, hosting)",
    ),
  url: z
    .string()
    .nullable()
    .describe("Main program page URL, or null if unknown"),
});

const categoryList = Object.entries(CATEGORY_LABELS)
  .map(([slug, label]) => `  ${slug} = "${label}"`)
  .join("\n");

const systemPrompt = `You extract structured details about open-source programs from web page content.

Valid category slugs (pick the single best match):
${categoryList}

Rules:
- Be concise and factual — only include information present on the page.
- For perks, each entry should have a short title and a description.
- For eligibility, list each requirement as a separate item.
- For applicationProcess, list each step as a separate item.
- Tags should be lowercase kebab-case keywords.
- If a field cannot be determined, use an empty array or null as appropriate.`;

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const markdown = await fetchPageContent(url);

    const { output } = await generateText({
      model: "google/gemini-2.0-flash",
      output: Output.object({ schema: autofillSchema }),
      prompt: `Extract the open-source program details from the following page content.\n\nPage URL: ${url}\n\n---\n\n${markdown}`,
      system: systemPrompt,
    });

    if (!output) {
      return NextResponse.json(
        { error: "Could not extract program details from this page" },
        { status: 422 },
      );
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error("Autofill program error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to extract program details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
