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
  const uid = `emoi-${emotion}`;
  const faceLight = active ? "#ffe4a0" : "#fff8ec";
  const faceMid   = active ? "#f5c15a" : "#f5d7b0";
  const faceDark  = active ? "#e89a28" : "#e8b87a";

  return (
    <svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-g`} cx="38%" cy="28%" r="72%">
          <stop offset="0%"   stopColor={faceLight} />
          <stop offset="55%"  stopColor={faceMid} />
          <stop offset="100%" stopColor={faceDark} />
        </radialGradient>
      </defs>

      {/* 구 본체 - clay 3D 질감 */}
      <circle cx="24" cy="25" r="21" fill={`url(#${uid}-g)`} />
      {/* 상단 하이라이트 */}
      <ellipse cx="16" cy="15" rx="5.5" ry="3.5" fill="white" opacity="0.45" transform="rotate(-22 16 15)" />

      {emotion === "happy" && <>
        <ellipse cx="13" cy="30" rx="5.5" ry="3.5" fill="#f0a5a5" opacity="0.70" />
        <ellipse cx="35" cy="30" rx="5.5" ry="3.5" fill="#f0a5a5" opacity="0.70" />
        {/* ㅅ 눈 */}
        <path d="M 16 23 Q 18.5 19.5 21 23" stroke="#3d2918" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M 27 23 Q 29.5 19.5 32 23" stroke="#3d2918" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* 입 */}
        <path d="M 17 31 Q 24 37 31 31" stroke="#c87028" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </>}

      {emotion === "excited" && <>
        <ellipse cx="13" cy="30" rx="5.5" ry="3.5" fill="#f0a5a5" opacity="0.70" />
        <ellipse cx="35" cy="30" rx="5.5" ry="3.5" fill="#f0a5a5" opacity="0.70" />
        {/* 동그란 눈 */}
        <circle cx="18" cy="23" r="4.5" fill="#3d2918" />
        <circle cx="30" cy="23" r="4.5" fill="#3d2918" />
        <circle cx="19.5" cy="21.5" r="1.7" fill="white" />
        <circle cx="31.5" cy="21.5" r="1.7" fill="white" />
        {/* 큰 미소 */}
        <path d="M 15 32 Q 24 39 33 32" stroke="#c87028" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <text x="35" y="15" fontSize="8" fill="#fbbf24" fontFamily="sans-serif">✦</text>
      </>}

      {emotion === "calm" && <>
        <ellipse cx="13" cy="30" rx="5" ry="3" fill="#f0a5a5" opacity="0.52" />
        <ellipse cx="35" cy="30" rx="5" ry="3" fill="#f0a5a5" opacity="0.52" />
        {/* 물결 눈 */}
        <path d="M 14 23 Q 16.5 20.5 19 23 Q 21.5 25.5 24 23" stroke="#3d2918" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 24 23 Q 26.5 20.5 29 23 Q 31.5 25.5 34 23" stroke="#3d2918" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* 일자 입 */}
        <line x1="19" y1="32" x2="29" y2="32" stroke="#c87028" strokeWidth="2" strokeLinecap="round" />
      </>}

      {emotion === "sad" && <>
        <ellipse cx="13" cy="30" rx="5.5" ry="3.5" fill="#b0c8e8" opacity="0.60" />
        <ellipse cx="35" cy="30" rx="5.5" ry="3.5" fill="#b0c8e8" opacity="0.60" />
        {/* 역 ㅅ 눈 */}
        <path d="M 16 21 Q 18.5 25.5 21 21" stroke="#3d2918" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M 27 21 Q 29.5 25.5 32 21" stroke="#3d2918" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* 눈물 */}
        <ellipse cx="17.5" cy="29" rx="2.2" ry="3.5" fill="#93c5fd" opacity="0.76" />
        <ellipse cx="30.5" cy="29" rx="2.2" ry="3.5" fill="#93c5fd" opacity="0.76" />
        {/* 처진 입 */}
        <path d="M 18 35 Q 24 30.5 30 35" stroke="#c87028" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </>}

      {emotion === "tired" && <>
        <ellipse cx="13" cy="30" rx="5.5" ry="3.5" fill="#f0a5a5" opacity="0.38" />
        <ellipse cx="35" cy="30" rx="5.5" ry="3.5" fill="#f0a5a5" opacity="0.38" />
        {/* 반쯤 감긴 눈 */}
        <path d="M 15 23 Q 18.5 26.5 22 23" stroke="#3d2918" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="14" y="17.5" width="9" height="6.5" rx="3.5" fill={faceMid} />
        <path d="M 26 23 Q 29.5 26.5 33 23" stroke="#3d2918" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="25" y="17.5" width="9" height="6.5" rx="3.5" fill={faceMid} />
        {/* 일자 입 */}
        <line x1="19" y1="33" x2="29" y2="33" stroke="#c87028" strokeWidth="2" strokeLinecap="round" />
        {/* zzz */}
        <text x="35" y="17" fontSize="8" fill="#9aa0ac" fontFamily="sans-serif">z</text>
        <text x="38.5" y="10" fontSize="5.5" fill="#9aa0ac" fontFamily="sans-serif">z</text>
      </>}
    </svg>
  );
}

export default function EmotionCloud({ selectedEmotion, onSelect }: Props) {
  return (
    <div className={styles.emotionCloudWrap} role="group" aria-label="감정을 선택하세요">
      {/* 구름 본체 */}
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
      {/* 말풍선 꼬리 점 — 아래 몽이 방향으로 */}
      <div className={styles.thoughtDot1} aria-hidden="true" />
      <div className={styles.thoughtDot2} aria-hidden="true" />
    </div>
  );
}
