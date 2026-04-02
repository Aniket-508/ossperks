import { z } from "zod";

import { isCanonicalSlug } from "./slug";

export const categoryEnum = z.enum([
  "hosting",
  "devtools",
  "security",
  "monitoring",
  "communication",
  "ci-cd",
  "testing",
  "ai",
  "analytics",
  "infrastructure",
  "credentials",
  "funding",
  "support",
]);

export type Category = z.infer<typeof categoryEnum>;

export const perkSchema = z.object({
  description: z.string(),
  title: z.string(),
});

export type Perk = z.infer<typeof perkSchema>;

export const contactSchema = z.object({
  bio: z.string().optional(),
  linkedin: z.url().optional(),
  name: z.string(),
  role: z.string().optional(),
  url: z.url().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export const programSchema = z.object({
  applicationProcess: z.array(z.string()).optional(),
  applicationUrl: z.url().optional(),
  category: categoryEnum,
  configFiles: z.array(z.string()).optional(),
  contact: contactSchema.optional(),
  description: z.string(),
  duration: z.string().optional(),
  eligibility: z.array(z.string()),
  name: z.string(),
  perks: z.array(perkSchema),
  provider: z.string(),
  requirements: z.array(z.string()).optional(),
  slug: z
    .string()
    .min(1)
    .refine(isCanonicalSlug, "Program slug must already be canonical"),
  tags: z.array(z.string()).optional(),
  techPackages: z.array(z.string()).optional(),
  url: z.url(),
});

export type Program = z.infer<typeof programSchema>;

export const perkTypeEnum = z.enum([
  "credits",
  "free-plans",
  "full-access",
  "security",
  "support",
]);

export type PerkType = z.infer<typeof perkTypeEnum>;

export const PERK_TYPE_LABELS: Record<PerkType, string> = {
  credits: "Credits",
  "free-plans": "Free Plans",
  "full-access": "Full Access",
  security: "Security",
  support: "Support",
} as const;

const PERK_TYPE_PATTERNS: [PerkType, RegExp][] = [
  ["credits", /credits?|minutes|events|transactions/i],
  ["free-plans", /\bfree\b/i],
  ["full-access", /\b(full|all|enterprise|ultimate|unlimited|complete)\b/i],
  ["security", /security|zero trust|codex security/i],
  ["support", /support|assistance/i],
];

export const getPerkType = (perkTitle: string): PerkType => {
  for (const [type, pattern] of PERK_TYPE_PATTERNS) {
    if (pattern.test(perkTitle)) {
      return type;
    }
  }
  return "full-access";
};

export const CATEGORY_LABELS: Record<Category, string> = {
  ai: "AI & Machine Learning",
  analytics: "Analytics",
  "ci-cd": "CI/CD",
  communication: "Communication",
  credentials: "Credentials & Secrets",
  devtools: "Developer Tools",
  funding: "Funding",
  hosting: "Hosting & Deployment",
  infrastructure: "Infrastructure",
  monitoring: "Monitoring & Observability",
  security: "Security",
  support: "Support",
  testing: "Testing",
} as const;
