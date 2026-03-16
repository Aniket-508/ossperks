import { z } from "zod";

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
]);

export type Category = z.infer<typeof categoryEnum>;

export const perkSchema = z.object({
  description: z.string(),
  title: z.string(),
});

export type Perk = z.infer<typeof perkSchema>;

export const contactSchema = z.object({
  name: z.string(),
  role: z.string(),
  url: z.string().url().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export const programSchema = z.object({
  applicationProcess: z.array(z.string()).optional(),
  applicationUrl: z.string().url().optional(),
  category: categoryEnum,
  contact: contactSchema.optional(),
  description: z.string(),
  duration: z.string().optional(),
  eligibility: z.array(z.string()),
  name: z.string(),
  perks: z.array(perkSchema),
  provider: z.string(),
  requirements: z.array(z.string()).optional(),
  slug: z.string(),
  tags: z.array(z.string()).optional(),
  url: z.string().url(),
});

export type Program = z.infer<typeof programSchema>;

export const PERK_TYPES = {
  credits: "Credits",
  freePlans: "Free Plans",
  fullAccess: "Full Access",
  security: "Security",
  support: "Support",
} as const;

export type PerkType = (typeof PERK_TYPES)[keyof typeof PERK_TYPES];

const PERK_TYPE_PATTERNS: [PerkType, RegExp][] = [
  [PERK_TYPES.credits, /credits?|minutes|events|transactions/i],
  [PERK_TYPES.freePlans, /\bfree\b/i],
  [
    PERK_TYPES.fullAccess,
    /\b(full|all|enterprise|ultimate|unlimited|complete)\b/i,
  ],
  [PERK_TYPES.security, /security|zero trust|codex security/i],
  [PERK_TYPES.support, /support|assistance/i],
];

export const getPerkType = (perkTitle: string): PerkType => {
  for (const [type, pattern] of PERK_TYPE_PATTERNS) {
    if (pattern.test(perkTitle)) {
      return type;
    }
  }
  return PERK_TYPES.fullAccess;
};

export const CATEGORY_LABELS: Record<Category, string> = {
  ai: "AI & Machine Learning",
  analytics: "Analytics",
  "ci-cd": "CI/CD",
  communication: "Communication",
  credentials: "Credentials & Secrets",
  devtools: "Developer Tools",
  hosting: "Hosting & Deployment",
  infrastructure: "Infrastructure",
  monitoring: "Monitoring & Observability",
  security: "Security",
  testing: "Testing",
};
