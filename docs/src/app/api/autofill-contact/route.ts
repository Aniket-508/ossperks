import { generateText, Output } from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { fetchPageContent } from "@/lib/fetch-page-content";

const autofillSchema = z.object({
  name: z.string().describe("Full name of the person"),
  role: z
    .string()
    .describe(
      "Professional role or job title (e.g. CEO, OSS Program Manager, Developer Advocate)",
    ),
});

const systemPrompt = `You extract a person's name and professional role from their profile page or website.

Rules:
- Only return information that is clearly present on the page.
- For role, prefer their current job title or professional description.
- If no role is found, use a reasonable inference from context (e.g. "Founder" if they own the site).`;

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
      prompt: `Extract the person's name and role from the following profile page.\n\nPage URL: ${url}\n\n---\n\n${markdown}`,
      system: systemPrompt,
    });

    if (!output) {
      return NextResponse.json(
        { error: "Could not extract contact details from this page" },
        { status: 422 },
      );
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error("Autofill contact error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to extract contact details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
