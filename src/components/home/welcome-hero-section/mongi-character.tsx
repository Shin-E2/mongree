// src/components/home/welcome-hero-section/mongi-character.tsx
"use client";

import type { MongreeThemeScene, MongiEmotion } from "@/components/theme/theme.types";
import styles from "./styles.module.css";

export type MongiVariant = "idle" | "bounce" | "big" | "react";

interface Props {
  scene: MongreeThemeScene;
  emotion: MongiEmotion | null;
  variant: MongiVariant;
  onTap?: () => void;
}

const LABEL: Record<MongreeThemeScene, string> = {
  day:   "맑은 날의 몽이",
  rain:  "비 오는 날의 몽이",
  snow:  "눈 오는 날의 몽이",
  night: "밤의 몽이",
};

function MongiEyes({ emotion }: { emotion: MongiEmotion | null }) {
  const e = emotion ?? "happy";
  if (e === "happy") return (
    <>
      <path d="M 50 83 Q 54 79 58 83" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 62 83 Q 66 79 70 83" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
  if (e === "excited") return (
    <>
      <circle cx="52" cy="84" r="5.5" fill="#2d2d3a" />
      <circle cx="68" cy="84" r="5.5" fill="#2d2d3a" />
      <circle cx="54" cy="82" r="2"   fill="#fff" />
      <circle cx="70" cy="82" r="2"   fill="#fff" />
    </>
  );
  if (e === "calm") return (
    <>
      <path d="M 49 83 Q 52 81 55 83 Q 58 85 61 83" stroke="#2d2d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 63 83 Q 66 81 69 83 Q 72 85 75 83" stroke="#2d2d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  );
  if (e === "sad") return (
    <>
      <path d="M 50 81 Q 54 85 58 81" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 62 81 Q 66 85 70 81" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="53" cy="89" rx="2.5" ry="3.5" fill="#93c5fd" opacity="0.6" />
      <ellipse cx="67" cy="89" rx="2.5" ry="3.5" fill="#93c5fd" opacity="0.6" />
    </>
  );
  // tired
  return (
    <>
      <path d="M 50 83 Q 54 86 58 83" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="48" y="77" width="12" height="7" rx="3" fill="#fff8f0" />
      <path d="M 62 83 Q 66 86 70 83" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="60" y="77" width="12" height="7" rx="3" fill="#fff8f0" />
      <text x="72" y="76" fontSize="7" fill="#a0a8b0" fontFamily="sans-serif">z</text>
      <text x="75" y="70" fontSize="5" fill="#a0a8b0" fontFamily="sans-serif">z</text>
    </>
  );
}

function MongiMouth({ emotion }: { emotion: MongiEmotion | null }) {
  const e = emotion ?? "happy";
  if (e === "happy")   return <path d="M 56 96 Q 60 100 64 96"  stroke="#c87028" strokeWidth="2"   fill="none" strokeLinecap="round" />;
  if (e === "excited") return <path d="M 54 97 Q 60 104 66 97"  stroke="#c87028" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  if (e === "calm")    return <line x1="57" y1="97" x2="63" y2="97" stroke="#c87028" strokeWidth="2" strokeLinecap="round" />;
  if (e === "sad")     return <path d="M 56 99 Q 60 95 64 99"   stroke="#c87028" strokeWidth="2"   fill="none" strokeLinecap="round" />;
  return <line x1="57" y1="97" x2="63" y2="97" stroke="#c87028" strokeWidth="2" strokeLinecap="round" />;
}

function UmbrellaAccessory() {
  return (
    <g>
      <path d="M 60 28 Q 22 38 20 62 Q 40 52 60 54 Q 80 52 100 62 Q 98 38 60 28 Z" fill="#4a90d9" stroke="#2d6faf" strokeWidth="1.5" />
      <line x1="60" y1="28" x2="60" y2="78" stroke="#2d6faf" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 60 78 Q 56 86 62 86 Q 68 86 64 78" stroke="#2d6faf" strokeWidth="2.5" fill="none" />
    </g>
  );
}

function StarCrownAccessory() {
  return (
    <path
      d="M 42 68 L 48 54 L 55 64 L 60 50 L 65 64 L 72 54 L 78 68 Z"
      fill="#fbbf24" stroke="#e8820a" strokeWidth="1"
    />
  );
}

function ScarfAccessory() {
  return (
    <>
      <ellipse cx="60" cy="105" rx="22" ry="7" fill="#e85050" />
      <ellipse cx="60" cy="108" rx="17" ry="5.5" fill="#e85050" />
      <rect x="55" y="106" width="12" height="16" rx="4" fill="#e85050" />
      <line x1="55" y1="106" x2="55" y2="122" stroke="#c83030" strokeWidth="1" opacity="0.4" />
      <line x1="67" y1="106" x2="67" y2="122" stroke="#c83030" strokeWidth="1" opacity="0.4" />
    </>
  );
}

function MongiBody({ scene, emotion }: { scene: MongreeThemeScene; emotion: MongiEmotion | null }) {
  const isNight = scene === "night";
  const displayEmotion = isNight ? "tired" : emotion;

  return (
    <svg
      viewBox="0 0 120 155"
      className={styles.mongiSvgCat}
      role="img"
      aria-label={LABEL[scene]}
      focusable="false"
    >
      {/* 그림자 */}
      <ellipse cx="60" cy="150" rx="36" ry="7" fill="rgba(200,130,60,0.18)" />

      {/* 소품: 우산 (비씬) */}
      {scene === "rain" && <UmbrellaAccessory />}

      {/* 꼬리 */}
      <g className={styles.tailGroup}>
        <path
          d="M 88 120 Q 105 102 103 84 Q 101 68 95 74"
          stroke="#f59c42" strokeWidth="7" fill="none" strokeLinecap="round"
        />
      </g>

      {/* 몸통 + 배 */}
      <ellipse cx="60" cy="110" rx="34" ry="38" fill="#fff8f0" />
      <ellipse cx="60" cy="117" rx="22" ry="26" fill="#f5d7b0" />

      {/* 왼쪽 팔 */}
      <g className={styles.leftArmGroup}>
        <ellipse cx="26" cy="117" rx="12" ry="8.5" fill="#fff8f0" transform="rotate(-20 26 117)" />
      </g>

      {/* 오른쪽 팔 */}
      <g className={styles.rightArmGroup}>
        <ellipse cx="94" cy="117" rx="12" ry="8.5" fill="#fff8f0" transform="rotate(20 94 117)" />
      </g>

      {/* 발 */}
      <ellipse cx="46" cy="144" rx="10" ry="10" fill="#fff8f0" />
      <ellipse cx="74" cy="144" rx="10" ry="10" fill="#fff8f0" />

      {/* 소품: 스카프 (눈씬) */}
      {scene === "snow" && <ScarfAccessory />}

      {/* 왼쪽 귀 */}
      <g className={styles.leftEarGroup}>
        <ellipse cx="38" cy="72" rx="14" ry="18" fill="#f59c42" transform="rotate(-15 38 72)" />
        <ellipse cx="38" cy="74" rx="9"  ry="12" fill="#f5d7b0" transform="rotate(-15 38 74)" />
      </g>

      {/* 오른쪽 귀 */}
      <g className={styles.rightEarGroup}>
        <ellipse cx="82" cy="72" rx="14" ry="18" fill="#f59c42" transform="rotate(15 82 72)" />
        <ellipse cx="82" cy="74" rx="9"  ry="12" fill="#f5d7b0" transform="rotate(15 82 74)" />
      </g>

      {/* 소품: 별왕관 (밤씬) */}
      {scene === "night" && <StarCrownAccessory />}

      {/* 머리 */}
      <ellipse cx="60" cy="85" rx="30" ry="28" fill="#fff8f0" />
      <ellipse cx="60" cy="82" rx="19" ry="17" fill="#f5d7b0" opacity="0.5" />

      {/* 볼터치 */}
      <ellipse cx="42" cy="91" rx="9" ry="6.5" fill="#f0a5a5" opacity="0.55" />
      <ellipse cx="78" cy="91" rx="9" ry="6.5" fill="#f0a5a5" opacity="0.55" />

      {/* 눈 — 그룹으로 묶어 깜빡임 가능 */}
      <g className={styles.eyesGroup}>
        <MongiEyes emotion={displayEmotion} />
      </g>

      {/* 코 */}
      <ellipse cx="60" cy="93" rx="4" ry="3" fill="#e8820a" opacity="0.7" />

      {/* 입 */}
      <MongiMouth emotion={displayEmotion} />

      {/* 수염 */}
      <line x1="28" y1="91" x2="44" y2="93" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      <line x1="28" y1="96" x2="44" y2="95" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      <line x1="76" y1="93" x2="92" y2="91" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      <line x1="76" y1="95" x2="92" y2="96" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />

      {/* 설레 반짝이 */}
      {displayEmotion === "excited" && (
        <>
          <text x="8"   y="70" fontSize="10" fill="#fbbf24" opacity="0.85" fontFamily="sans-serif">✦</text>
          <text x="102" y="67" fontSize="8"  fill="#fbbf24" opacity="0.75" fontFamily="sans-serif">✦</text>
        </>
      )}
    </svg>
  );
}

export default function MongiCharacter({ scene, emotion, variant, onTap }: Props) {
  const isBig    = variant === "big" || variant === "react";
  const isBounce = variant === "bounce";

  return (
    <div
      className={`${styles.mongiWrap} ${isBig ? styles.mongiWrapBig : ""} ${variant === "idle" ? styles.mongiFloat : ""} ${isBounce ? styles.mongiBounce : ""}`}
      onClick={onTap}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onTap?.(); }}
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      aria-label={onTap ? "몽이를 탭하세요" : undefined}
    >
      <MongiBody scene={scene} emotion={emotion} />
    </div>
  );
}
