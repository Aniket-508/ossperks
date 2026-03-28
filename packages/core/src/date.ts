export type TimeUnit = "today" | "yesterday" | "days" | "months" | "years";

export interface TimeUnitResult {
  unit: TimeUnit;
  value: number;
}

export const calculateTimeUnits = (date: Date): TimeUnitResult => {
  const days = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) {
    return { unit: "today", value: 0 };
  }
  if (days === 1) {
    return { unit: "yesterday", value: 1 };
  }
  if (days < 30) {
    return { unit: "days", value: days };
  }
  if (days < 365) {
    return { unit: "months", value: Math.floor(days / 30) };
  }
  return { unit: "years", value: Math.floor(days / 365) };
};

export interface TimeRelParts<S, F> {
  today: S;
  yesterday: S;
  daysAgo: F;
  monthsAgo: F;
  yearsAgo: F;
}

export type TimeFormatter = TimeRelParts<string, (count: number) => string>;
export type TimeTemplates = TimeRelParts<string, string>;

export const templateFormatter = (t: TimeTemplates): TimeFormatter => ({
  daysAgo: (d) => t.daysAgo.replace("{days}", String(d)),
  monthsAgo: (m) => t.monthsAgo.replace("{months}", String(m)),
  today: t.today,
  yearsAgo: (y) => t.yearsAgo.replace("{years}", String(y)),
  yesterday: t.yesterday,
});

export const englishFormatter: TimeFormatter = {
  daysAgo: (d) => `${d} days ago`,
  monthsAgo: (m) => `${m} months ago`,
  today: "today",
  yearsAgo: (y) => `${y} years ago`,
  yesterday: "yesterday",
};

export const formatRelativeTime = (
  date: Date,
  formatter: TimeFormatter,
): string => {
  const result = calculateTimeUnits(date);
  switch (result.unit) {
    case "today": {
      return formatter.today;
    }
    case "yesterday": {
      return formatter.yesterday;
    }
    case "days": {
      return formatter.daysAgo(result.value);
    }
    case "months": {
      return formatter.monthsAgo(result.value);
    }
    case "years": {
      return formatter.yearsAgo(result.value);
    }
    default: {
      throw new Error(`Unexpected time unit: ${String(result.unit)}`);
    }
  }
};
