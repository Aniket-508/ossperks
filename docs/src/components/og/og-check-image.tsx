import type { ReactNode } from "react";

import {
  CodebergIcon,
  GitHubIcon,
  GiteaIcon,
  GitLabIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { SITE } from "@/constants/site";
import { OG_FONT_FAMILY } from "@/lib/og";

type Provider = "codeberg" | "gitea" | "github" | "gitlab";

interface OgCheckStats {
  eligible: number;
  ineligible: number;
  needsReview: number;
}

interface OgCheckImageProps {
  description?: string | null;
  provider: Provider;
  repoPath: string;
  stars: number;
  stats: OgCheckStats;
}

const PROVIDER_ICONS: Record<Provider, ReactNode> = {
  codeberg: <CodebergIcon width={22} height={22} />,
  gitea: <GiteaIcon width={22} height={22} />,
  github: <GitHubIcon width={22} height={22} />,
  gitlab: <GitLabIcon width={22} height={22} />,
};

const STAT_COLORS = {
  eligible: "#10b981",
  ineligible: "#ef4444",
  needsReview: "#f59e0b",
} as const;

const formatStars = (stars: number): string => {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(stars >= 10_000 ? 0 : 1)}k`;
  }
  return String(stars);
};

const StatBox = ({
  color,
  count,
  label,
}: {
  color: string;
  count: number;
  label: string;
}) => (
  <div
    style={{
      alignItems: "center",
      border: `1px solid ${color}33`,
      borderRadius: 12,
      display: "flex",
      flex: 1,
      flexDirection: "column",
      gap: 4,
      padding: "20px 16px",
    }}
  >
    <span style={{ color, fontSize: 48, fontWeight: 600, lineHeight: 1 }}>
      {count}
    </span>
    <span
      style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: 18,
        fontWeight: 400,
      }}
    >
      {label}
    </span>
  </div>
);

const OgCheckImage = ({
  description,
  provider,
  repoPath,
  stars,
  stats,
}: OgCheckImageProps) => (
  <div
    style={{
      background: "#0c0c0c",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: OG_FONT_FAMILY,
      height: "100%",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    }}
  >
    <div
      style={{
        background:
          "radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.32) 0%, rgba(234,88,12,0.1) 35%, transparent 65%)",
        bottom: 0,
        display: "flex",
        height: "100%",
        left: 0,
        position: "absolute",
        width: "100%",
      }}
    />
    <div
      style={{
        background:
          "radial-gradient(ellipse at 65% 80%, rgba(251,146,60,0.12) 0%, transparent 50%)",
        bottom: 0,
        display: "flex",
        height: "100%",
        left: 0,
        position: "absolute",
        width: "100%",
      }}
    />

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "48px 56px",
        position: "relative",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
          <LogoMark width={28} height={28} />
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {SITE.NAME}
          </span>
        </div>
        <div
          style={{
            alignItems: "center",
            color: "rgba(255,255,255,0.6)",
            display: "flex",
            gap: 12,
          }}
        >
          {PROVIDER_ICONS[provider]}
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 20,
              gap: 6,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>{formatStars(stars)}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {repoPath.length > 32 ? `${repoPath.slice(0, 30)}...` : repoPath}
        </span>
        {description ? (
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 22,
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: "90%",
            }}
          >
            {description.length > 100
              ? `${description.slice(0, 97)}...`
              : description}
          </span>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, width: "100%" }}>
          <StatBox
            color={STAT_COLORS.eligible}
            count={stats.eligible}
            label="Eligible"
          />
          <StatBox
            color={STAT_COLORS.needsReview}
            count={stats.needsReview}
            label="Needs Review"
          />
          <StatBox
            color={STAT_COLORS.ineligible}
            count={stats.ineligible}
            label="Ineligible"
          />
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
            <div
              style={{
                backgroundColor: "rgba(245,158,11,0.5)",
                borderRadius: 2,
                height: 3,
                width: 48,
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Eligibility Check
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OgCheckImage;
