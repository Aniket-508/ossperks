import type { ReactNode } from "react";

import { LogoMark } from "@/components/logo";
import { SITE } from "@/constants/site";

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
      alignItems: "stretch",
      background:
        "linear-gradient(135deg, rgb(37, 37, 37) 0%, rgb(120, 65, 25) 52%, rgb(199, 108, 30) 100%)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Geist",
      height: "100%",
      justifyContent: "space-between",
      padding: 64,
      paddingBottom: 64,
      width: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginBottom: "40px",
          textWrap: "pretty",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.1,
          }}
        >
          {title}
        </span>
        {description !== undefined &&
        description !== null &&
        description !== "" ? (
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 36,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
              maxWidth: "95%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </span>
        ) : null}
      </div>
    </div>

    <div
      style={{
        alignItems: "center",
        color: "white",
        display: "flex",
        gap: 20,
      }}
    >
      <LogoMark width={36} height={36} />
      <span
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        {siteName}
      </span>
      <div style={{ flexGrow: 1 }} />
      {footerLabel !== undefined && footerLabel !== "" ? (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: 2,
              height: 4,
              opacity: 0.9,
              width: 60,
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.2em",
              opacity: 0.9,
              textTransform: "uppercase",
            }}
          >
            {footerLabel}
          </span>
        </div>
      ) : null}
    </div>
  </div>
);

export default OgImage;
