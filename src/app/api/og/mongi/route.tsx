import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const nickname = searchParams.get("nickname") ?? "몽이";
  const level = Number(searchParams.get("level") ?? "1");
  const streak = Number(searchParams.get("streak") ?? "0");
  const expression = searchParams.get("expression") ?? "happy";

  const eyeColor = "#33303C";

  function Eyes() {
    if (expression === "excited") {
      return (
        <>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: eyeColor, position: "relative", display: "flex" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: "3px" }} />
          </div>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: eyeColor, position: "relative", display: "flex" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: "3px" }} />
          </div>
        </>
      );
    }
    if (expression === "sleepy") {
      return (
        <>
          <div style={{ width: "22px", height: "12px", borderRadius: "0 0 11px 11px", background: eyeColor }} />
          <div style={{ width: "22px", height: "12px", borderRadius: "0 0 11px 11px", background: eyeColor }} />
        </>
      );
    }
    return (
      <>
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: eyeColor }} />
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: eyeColor }} />
      </>
    );
  }

  const bgGrad = expression === "sleepy"
    ? "linear-gradient(150deg, #1A1F3A 0%, #252B4A 50%, #2D1B4E 100%)"
    : "linear-gradient(150deg, #FFF8F0 0%, #F5EDE0 40%, #EDE0D4 100%)";

  const textColor = expression === "sleepy" ? "#E2E8F0" : "#4A3728";
  const subColor = expression === "sleepy" ? "#A0AEC0" : "#A07858";

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
          background: bgGrad,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* decorative stars for sleepy / clouds for day */}
        {expression === "sleepy" ? (
          <>
            <div style={{ position: "absolute", top: "60px", left: "80px", width: "8px", height: "8px", borderRadius: "50%", background: "#F6C90E", opacity: 0.8 }} />
            <div style={{ position: "absolute", top: "120px", left: "200px", width: "5px", height: "5px", borderRadius: "50%", background: "#F6C90E", opacity: 0.6 }} />
            <div style={{ position: "absolute", top: "80px", right: "120px", width: "6px", height: "6px", borderRadius: "50%", background: "#F6C90E", opacity: 0.7 }} />
          </>
        ) : (
          <div style={{
            position: "absolute",
            top: "40px",
            right: "80px",
            width: "160px",
            height: "50px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.68)",
            boxShadow: "36px -16px 0 -8px rgba(255,255,255,0.58), 72px 2px 0 -12px rgba(255,255,255,0.5)",
          }} />
        )}

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
            boxShadow: "0 12px 32px rgba(140,100,70,0.15)",
            marginBottom: "24px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "16px", marginTop: "-8px" }}>
            <Eyes />
          </div>
        </div>

        {/* Nickname + level badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <div style={{ fontSize: "36px", fontWeight: "800", color: textColor }}>
            {nickname}의 몽이
          </div>
          <div style={{
            background: "#F5A978",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "700",
            padding: "4px 14px",
            borderRadius: "999px",
          }}>
            Lv.{level}
          </div>
        </div>

        {/* Streak */}
        {streak >= 1 && (
          <div style={{ fontSize: "18px", color: subColor, marginBottom: "24px" }}>
            {streak}일 연속 기록 중
          </div>
        )}

        {/* Brand */}
        <div style={{ fontSize: "16px", color: subColor, letterSpacing: "0.06em", fontWeight: "600" }}>
          Mongree
        </div>

        {/* Bottom bar */}
        <div style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "6px",
          background: "#F5D5BC",
        }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
