import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const EMOTION_COLORS: Record<string, string> = {
  기쁨: "#F6C90E",
  설렘: "#F4A5C6",
  평온: "#A8D8EA",
  슬픔: "#90A4AE",
  불안: "#BCAAA4",
  화남: "#EF9A9A",
  피곤: "#B0BEC5",
  감사: "#C8E6C9",
  외로움: "#B39DDB",
};

function emotionColor(name: string) {
  return EMOTION_COLORS[name] ?? "#E0D6CC";
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const monthLabel = searchParams.get("month") ?? "이번 달";
  const emotionsParam = searchParams.get("emotions") ?? "";
  const emotions = emotionsParam
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .slice(0, 3);

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
          background: "linear-gradient(150deg, #FFF8F0 0%, #F5EDE0 40%, #EDE0D4 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* decorative cloud top-right */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "60px",
            width: "180px",
            height: "60px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.72)",
            boxShadow: "40px -18px 0 -8px rgba(255,255,255,0.64), 80px 2px 0 -14px rgba(255,255,255,0.56)",
          }}
        />

        {/* Cat face */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "#FFF8F0",
            border: "3px solid #F5D5BC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 32px rgba(140,100,70,0.15)",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "14px", marginTop: "-6px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#33303C" }} />
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#33303C" }} />
          </div>
        </div>

        {/* Brand + month */}
        <div style={{ fontSize: "20px", color: "#A07858", fontWeight: "600", marginBottom: "6px", letterSpacing: "0.04em" }}>
          Mongree
        </div>
        <div style={{ fontSize: "36px", fontWeight: "800", color: "#4A3728", marginBottom: "28px", letterSpacing: "-0.5px" }}>
          {monthLabel} 감정 리포트
        </div>

        {/* Emotion pills */}
        {emotions.length > 0 && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", maxWidth: "700px" }}>
            {emotions.map((em) => (
              <div
                key={em}
                style={{
                  padding: "10px 24px",
                  borderRadius: "999px",
                  background: emotionColor(em),
                  color: "#4A3728",
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                {em}
              </div>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "#F5D5BC",
          }}
        />

        {/* Privacy note */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            fontSize: "13px",
            color: "#B09880",
          }}
        >
          일기 원문 미포함
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
