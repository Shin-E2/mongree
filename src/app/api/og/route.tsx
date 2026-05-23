import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const THEMES = {
  day: {
    sky: "#E8F4FD",
    skyMid: "#C5E3F7",
    ground: "#F5F0E8",
    accent: "#7BBDE4",
    text: "#4A5568",
    sub: "#718096",
  },
  night: {
    sky: "#1A1F3A",
    skyMid: "#252B4A",
    ground: "#2D1B4E",
    accent: "#F6C90E",
    text: "#E2E8F0",
    sub: "#A0AEC0",
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const theme = searchParams.get("theme") === "night" ? "night" : "day";
  const title = searchParams.get("title") ?? "오늘의 감정을 기록하는 작은 일기장";
  const colors = THEMES[theme];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${colors.sky} 0%, ${colors.skyMid} 50%, ${colors.ground} 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Cat face */}
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "#FFF8F0",
            border: "3px solid #F5D5BC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 32px rgba(140,100,70,0.18)",
            marginBottom: "28px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "16px", marginTop: "-8px" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#33303C" }} />
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#33303C" }} />
          </div>
        </div>

        {/* Brand */}
        <div style={{ fontSize: "52px", fontWeight: "800", color: colors.text, letterSpacing: "-1px", marginBottom: "12px" }}>
          Mongree
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: colors.sub,
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {title}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: colors.accent,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
