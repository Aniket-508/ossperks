import type { ReactNode } from "react";

import { LogoMark } from "@/components/logo";
import { SITE } from "@/constants/site";
import { OG_FONT_FAMILY } from "@/lib/og";

interface OgImageProps {
  description?: ReactNode;
  footerLabel?: string;
  siteName?: string;
  title: ReactNode;
}

const OgImage = ({
  description,
  footerLabel,
  siteName = SITE.NAME,
  title,
}: OgImageProps) => (
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
    {/* Radial glow from bottom */}
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

    {/* Secondary glow for warmth */}
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

    {/* Content */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 56,
        position: "relative",
      }}
    >
      {/* Top: Logo + site name */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 12,
        }}
      >
        <LogoMark width={28} height={28} />
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {siteName}
        </span>
      </div>

      {/* Center: Title + description */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <span
          style={{
            fontSize: 68,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {title}
        </span>
        {description !== undefined &&
        description !== null &&
        description !== "" ? (
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: "85%",
              textAlign: "center",
            }}
          >
            {description}
          </span>
        ) : null}
      </div>

      {/* Bottom: footer label */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
          minHeight: 28,
        }}
      >
        {footerLabel !== undefined && footerLabel !== "" ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 16,
            }}
          >
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
              {footerLabel}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export default OgImage;
