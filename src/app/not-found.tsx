import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Image
        src="/characters/mongi/sleepy.png"
        alt="몽이"
        width={120}
        height={120}
        priority
        unoptimized
        style={{ opacity: 0.85 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
          }}
        >
          404
        </p>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          페이지를 찾을 수 없어요
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          주소가 잘못됐거나 페이지가 사라졌어요
        </p>
      </div>
      <Link
        href="/"
        style={{
          marginTop: "0.5rem",
          padding: "0.625rem 1.5rem",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.8)",
          fontSize: "0.875rem",
          textDecoration: "none",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        처음으로 돌아가기
      </Link>
    </div>
  );
}
