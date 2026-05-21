// src/components/home/welcome-hero-section/diary-float.tsx
"use client";

import type { MongiEmotion } from "@/components/theme/theme.types";
import styles from "./styles.module.css";

interface Props {
  emotion: MongiEmotion;
  onTap: () => void;
}

const GLOW_COLOR: Record<MongiEmotion, string> = {
  happy:   "rgba(245,156,66,0.55)",
  excited: "rgba(251,191,36,0.6)",
  calm:    "rgba(110,210,180,0.5)",
  sad:     "rgba(147,197,253,0.55)",
  tired:   "rgba(160,168,176,0.45)",
};

const DIARY_COLOR: Record<MongiEmotion, { bg: string; border: string }> = {
  happy:   { bg: "linear-gradient(135deg, #fff8f0, #fde8c8)", border: "#f59c42" },
  excited: { bg: "linear-gradient(135deg, #fffde8, #fde68a)", border: "#fbbf24" },
  calm:    { bg: "linear-gradient(135deg, #f0fdf8, #d1fae5)", border: "#6ee7b7" },
  sad:     { bg: "linear-gradient(135deg, #eff6ff, #bfdbfe)", border: "#93c5fd" },
  tired:   { bg: "linear-gradient(135deg, #f9fafb, #e5e7eb)", border: "#9ca3af" },
};

export default function DiaryFloat({ emotion, onTap }: Props) {
  const glow = GLOW_COLOR[emotion];
  const { bg, border } = DIARY_COLOR[emotion];

  return (
    <div className={styles.diaryFloatOuter}>
      <div className={styles.diaryGlowOrb} style={{ boxShadow: `0 0 60px 20px ${glow}` }} aria-hidden="true" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.diarySparkle} data-i={i} aria-hidden="true" />
      ))}
      <div className={styles.diaryRing1} style={{ borderColor: border }} aria-hidden="true" />
      <div className={styles.diaryRing2} style={{ borderColor: border }} aria-hidden="true" />
      <button
        type="button"
        className={styles.diaryBook}
        style={{ background: bg, borderColor: border }}
        onClick={onTap}
        aria-label="다이어리를 탭하여 시작하기"
      >
        <div className={styles.diaryBookLine} style={{ backgroundColor: border }} />
        <div className={styles.diaryBookLine} style={{ backgroundColor: border, width: "60%" }} />
        <div className={styles.diaryBookLine} style={{ backgroundColor: border }} />
        <span className={styles.diaryBookLock} aria-hidden="true">🔐</span>
      </button>
      <p className={styles.diaryTapHint}>탭하세요</p>
    </div>
  );
}
