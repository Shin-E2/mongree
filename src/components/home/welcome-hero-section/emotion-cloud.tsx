// src/components/home/welcome-hero-section/emotion-cloud.tsx
"use client";

import type { MongiEmotion } from "@/components/theme/theme.types";
import styles from "./styles.module.css";

interface Props {
  selectedEmotion: MongiEmotion | null;
  onSelect: (emotion: MongiEmotion) => void;
}

const EMOTIONS: { id: MongiEmotion; label: string }[] = [
  { id: "happy",   label: "행복해" },
  { id: "excited", label: "설레"   },
  { id: "calm",    label: "평온해" },
  { id: "sad",     label: "슬퍼"   },
  { id: "tired",   label: "지쳤어" },
];

function EmotionIcon({ emotion, active }: { emotion: MongiEmotion; active: boolean }) {
  const base = active ? "#fbbf24" : "#fef3e8";
  const stroke = active ? "#e8820a" : "#f5d7b0";

  if (emotion === "happy") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill={base} stroke={stroke} strokeWidth="1.5" />
        <path d="M 12 17 Q 14.5 14 17 17" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 19 17 Q 21.5 14 24 17" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 12 22 Q 18 27 24 22" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (emotion === "excited") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill={base} stroke={stroke} strokeWidth="1.5" />
        <circle cx="13" cy="17" r="3.5" fill="#2d2d3a" />
        <circle cx="23" cy="17" r="3.5" fill="#2d2d3a" />
        <circle cx="14.5" cy="15.5" r="1.4" fill="#fff" />
        <circle cx="24.5" cy="15.5" r="1.4" fill="#fff" />
        <path d="M 11 23 Q 18 29 25 23" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="25" y="10" fontSize="6" fill="#fbbf24" fontFamily="sans-serif">✦</text>
      </svg>
    );
  }
  if (emotion === "calm") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill={base} stroke={stroke} strokeWidth="1.5" />
        <path d="M 11 17 Q 13.5 15 16 17 Q 18.5 19 21 17 Q 23.5 15 26 17" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="13" y1="23" x2="23" y2="23" stroke="#2d2d3a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (emotion === "sad") {
    return (
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill={base} stroke={stroke} strokeWidth="1.5" />
        <path d="M 12 16 Q 14.5 20 17 16" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 19 16 Q 21.5 20 24 16" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 12 25 Q 18 20 24 25" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="13.5" cy="21" rx="2.5" ry="3.5" fill="#93c5fd" opacity="0.65" />
        <ellipse cx="22.5" cy="21" rx="2.5" ry="3.5" fill="#93c5fd" opacity="0.65" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill={base} stroke={stroke} strokeWidth="1.5" />
      <path d="M 12 17 Q 14.5 20 17 17" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="11" y="12" width="7" height="6" rx="3" fill={base} />
      <path d="M 19 17 Q 21.5 20 24 17" stroke="#2d2d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="18" y="12" width="7" height="6" rx="3" fill={base} />
      <line x1="13" y1="23" x2="23" y2="23" stroke="#2d2d3a" strokeWidth="2" strokeLinecap="round" />
      <text x="26" y="13" fontSize="6" fill="#a0a8b0" fontFamily="sans-serif">z</text>
      <text x="28.5" y="9" fontSize="4.5" fill="#a0a8b0" fontFamily="sans-serif">z</text>
    </svg>
  );
}

export default function EmotionCloud({ selectedEmotion, onSelect }: Props) {
  return (
    <div className={styles.emotionCloudWrap} role="group" aria-label="감정을 선택하세요">
      <div className={styles.thoughtDot1} aria-hidden="true" />
      <div className={styles.thoughtDot2} aria-hidden="true" />
      <div className={styles.emotionCloud}>
        <p className={styles.emotionCloudLabel}>지금 기분은?</p>
        <div className={styles.emotionRow}>
          {EMOTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.emotionBtn} ${selectedEmotion === id ? styles.emotionBtnActive : ""}`}
              onClick={() => onSelect(id)}
              aria-label={label}
              aria-pressed={selectedEmotion === id}
            >
              <EmotionIcon emotion={id} active={selectedEmotion === id} />
              <span className={styles.emotionBtnLabel}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
