import type { EligibilityStatus, RepoProvider } from "@ossperks/core";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";

import type { CheckUrlSearchParams } from "@/types/check";

export const CHECK_PAGE_CONTAINER =
  "view-container max-w-4xl flex-1 flex flex-col";

export const DEFAULT_PROVIDER: RepoProvider = "github";

export const parseCheckUrlSearch = (
  sp: Record<string, string | string[] | undefined> | undefined,
): CheckUrlSearchParams => {
  if (!sp) {
    return { owner: null, path: null, provider: null, repo: null };
  }

  const first = (key: string): string | null => {
    const v = sp[key];
    if (v === undefined) {
      return null;
    }
    return Array.isArray(v) ? (v[0] ?? null) : v;
  };

  return {
    owner: first("owner"),
    path: first("path"),
    provider: first("provider"),
    repo: first("repo"),
  };
};

export const STATUS_CONFIG: Record<
  EligibilityStatus,
  {
    color: string;
    icon: typeof CircleCheck;
    ring: string;
  }
> = {
  eligible: {
    color: "text-emerald-500",
    icon: CircleCheck,
    ring: "ring-emerald-500/20",
  },
  ineligible: {
    color: "text-red-500",
    icon: CircleX,
    ring: "ring-red-500/20",
  },
  "needs-review": {
    color: "text-amber-500",
    icon: CircleAlert,
    ring: "ring-amber-500/20",
  },
};

export type StatusLabelKey = "eligible" | "ineligible" | "needsReview";

export const STATUS_LABELS: Record<EligibilityStatus, StatusLabelKey> = {
  eligible: "eligible",
  ineligible: "ineligible",
  "needs-review": "needsReview",
};
