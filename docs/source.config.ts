import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

const perkSchema = z.object({
  description: z.string(),
  title: z.string(),
});

const programPageSchema = pageSchema.extend({
  applicationProcess: z.array(z.string()).optional(),
  applicationUrl: z.string().nullable().optional(),
  category: z.string().optional(),
  duration: z.string().nullable().optional(),
  eligibility: z.array(z.string()).optional(),
  perks: z.array(perkSchema).optional(),
  provider: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  url: z.string().optional(),
});

export const cli = defineDocs({
  dir: "content/cli",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export const programDocs = defineDocs({
  dir: "content/programs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
    schema: programPageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {},
});
