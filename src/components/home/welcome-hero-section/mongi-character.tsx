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
  day: "맑은 날의 몽이",
  rain: "비 오는 날의 몽이",
  snow: "눈 오는 날의 몽이",
  night: "밤의 몽이",
};

function MongiEyes({ emotion }: { emotion: MongiEmotion | null }) {
  const e = emotion ?? "happy";
  if (e === "happy") {
    return (
      <>
        <path d="M 50 83 Q 54 79 58 83" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 62 83 Q 66 79 70 83" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (e === "excited") {
    return (
      <>
        <circle cx="52" cy="84" r="5.5" fill="#2d2d3a" />
        <circle cx="68" cy="84" r="5.5" fill="#2d2d3a" />
        <circle cx="54" cy="82" r="2" fill="#fff" />
        <circle cx="70" cy="82" r="2" fill="#fff" />
      </>
    );
  }
  if (e === "calm") {
    return (
      <>
        <path d="M 49 83 Q 52 81 55 83 Q 58 85 61 83" stroke="#2d2d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 63 83 Q 66 81 69 83 Q 72 85 75 83" stroke="#2d2d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </>
    );
  }
  if (e === "sad") {
    return (
      <>
        <path d="M 50 81 Q 54 85 58 81" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 62 81 Q 66 85 70 81" stroke="#2d2d3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="53" cy="89" rx="2.5" ry="3.5" fill="#93c5fd" opacity="0.6" />
        <ellipse cx="67" cy="89" rx="2.5" ry="3.5" fill="#93c5fd" opacity="0.6" />
      </>
    );
  }
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
  if (e === "happy") {
    return <path d="M 56 96 Q 60 100 64 96" stroke="#c87028" strokeWidth="2" fill="none" strokeLinecap="round" />;
  }
  if (e === "excited") {
    return <path d="M 54 97 Q 60 104 66 97" stroke="#c87028" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
  }
  if (e === "calm") {
    return <line x1="57" y1="97" x2="63" y2="97" stroke="#c87028" strokeWidth="2" strokeLinecap="round" />;
  }
  if (e === "sad") {
    return <path d="M 56 99 Q 60 95 64 99" stroke="#c87028" strokeWidth="2" fill="none" strokeLinecap="round" />;
  }
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
      fill="#fbbf24"
      stroke="#e8820a"
      strokeWidth="1"
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

function MongiBody({ scene, emotion, bounce }: { scene: MongreeThemeScene; emotion: MongiEmotion | null; bounce: boolean }) {
  const isNight = scene === "night";
  return (
    <svg
      viewBox="0 0 120 155"
      className={`${styles.mongiSvgCat} ${bounce ? styles.mongiBounce : ""}`}
      role="img"
      aria-label={LABEL[scene]}
      focusable="false"
    >
      <ellipse cx="60" cy="150" rx="36" ry="7" fill="rgba(200,130,60,0.18)" />
      {scene === "rain" && <UmbrellaAccessory />}
      <path d="M 88 120 Q 105 102 103 84 Q 101 68 95 74" stroke="#f59c42" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="110" rx="34" ry="38" fill="#fff8f0" />
      <ellipse cx="60" cy="117" rx="22" ry="26" fill="#f5d7b0" />
      <ellipse cx="26" cy="117" rx="12" ry="8.5" fill="#fff8f0" transform="rotate(-20 26 117)" />
      <ellipse cx="94" cy="117" rx="12" ry="8.5" fill="#fff8f0" transform="rotate(20 94 117)" />
      <ellipse cx="46" cy="144" rx="10" ry="10" fill="#fff8f0" />
      <ellipse cx="74" cy="144" rx="10" ry="10" fill="#fff8f0" />
      {scene === "snow" && <ScarfAccessory />}
      <ellipse cx="38" cy="72" rx="14" ry="18" fill="#f59c42" transform="rotate(-15 38 72)" />
      <ellipse cx="38" cy="74" rx="9" ry="12" fill="#f5d7b0" transform="rotate(-15 38 74)" />
      <ellipse cx="82" cy="72" rx="14" ry="18" fill="#f59c42" transform="rotate(15 82 72)" />
      <ellipse cx="82" cy="74" rx="9" ry="12" fill="#f5d7b0" transform="rotate(15 82 74)" />
      {scene === "night" && <StarCrownAccessory />}
      <ellipse cx="60" cy="85" rx="30" ry="28" fill="#fff8f0" />
      <ellipse cx="60" cy="82" rx="19" ry="17" fill="#f5d7b0" opacity="0.5" />
      <ellipse cx="42" cy="91" rx="9" ry="6.5" fill="#f0a5a5" opacity="0.55" />
      <ellipse cx="78" cy="91" rx="9" ry="6.5" fill="#f0a5a5" opacity="0.55" />
      <MongiEyes emotion={isNight ? "tired" : emotion} />
      <ellipse cx="60" cy="93" rx="4" ry="3" fill="#e8820a" opacity="0.7" />
      <MongiMouth emotion={isNight ? "tired" : emotion} />
      <line x1="28" y1="91" x2="44" y2="93" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      <line x1="28" y1="96" x2="44" y2="95" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      <line x1="76" y1="93" x2="92" y2="91" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      <line x1="76" y1="95" x2="92" y2="96" stroke="#c8a88a" strokeWidth="1.2" opacity="0.6" />
      {emotion === "excited" && (
        <>
          <text x="8" y="70" fontSize="10" fill="#fbbf24" opacity="0.85" fontFamily="sans-serif">✦</text>
          <text x="102" y="67" fontSize="8" fill="#fbbf24" opacity="0.75" fontFamily="sans-serif">✦</text>
        </>
      )}
    </svg>
  );
}

function SnowScene({ emotion, bounce }: { emotion: MongiEmotion | null; bounce: boolean }) {
  return (
    <svg
      viewBox="0 0 220 160"
      className={`${styles.mongiSvgSnow} ${bounce ? styles.mongiBounce : ""}`}
      role="img"
      aria-label="눈 오는 날의 몽이"
      focusable="false"
    >
      <ellipse cx="170" cy="155" rx="28" ry="6" fill="rgba(100,140,180,0.2)" />
      <circle cx="170" cy="133" r="22" fill="white" stroke="#c8ddf0" strokeWidth="1.5" />
      <circle cx="170" cy="104" r="15" fill="white" stroke="#c8ddf0" strokeWidth="1.5" />
      <circle cx="164" cy="100" r="2.2" fill="#5a6a80" />
      <circle cx="176" cy="100" r="2.2" fill="#5a6a80" />
      <ellipse cx="170" cy="105" rx="5.5" ry="2" fill="#e8820a" transform="rotate(-10 170 105)" />
      <circle cx="164" cy="110" r="1.4" fill="#5a6a80" />
      <circle cx="170" cy="112" r="1.4" fill="#5a6a80" />
      <circle cx="176" cy="110" r="1.4" fill="#5a6a80" />
      <circle cx="170" cy="122" r="2" fill="#8aa8c8" />
      <circle cx="170" cy="131" r="2" fill="#8aa8c8" />
      <circle cx="170" cy="140" r="2" fill="#8aa8c8" />
      <line x1="148" y1="110" x2="136" y2="99" stroke="#8a7060" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="136" y1="99" x2="132" y2="94" stroke="#8a7060" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="136" y1="99" x2="130" y2="102" stroke="#8a7060" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="192" y1="108" x2="204" y2="97" stroke="#8a7060" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="204" y1="97" x2="209" y2="92" stroke="#8a7060" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="159" y="86" width="22" height="4" rx="2" fill="#3a4a6a" />
      <rect x="161" y="74" width="18" height="13" rx="3" fill="#3a4a6a" />
      <ellipse cx="68" cy="155" rx="32" ry="6" fill="rgba(100,140,180,0.2)" />
      <circle cx="46" cy="144" r="15" fill="white" stroke="#c8ddf0" strokeWidth="1.5" />
      <circle cx="46" cy="144" r="10" fill="rgba(200,225,245,0.4)" />
      <ellipse cx="74" cy="120" rx="28" ry="30" fill="#fff8f0" />
      <ellipse cx="74" cy="127" rx="18" ry="21" fill="#f5d7b0" />
      <ellipse cx="74" cy="103" rx="20" ry="7" fill="#e85050" />
      <ellipse cx="74" cy="106" rx="15" ry="5.5" fill="#e85050" />
      <rect x="68" y="105" width="12" height="15" rx="4" fill="#e85050" />
      <ellipse cx="48" cy="130" rx="14" ry="9" fill="#fff8f0" transform="rotate(-38 48 130)" />
      <ellipse cx="100" cy="128" rx="13" ry="8.5" fill="#fff8f0" transform="rotate(18 100 128)" />
      <ellipse cx="62" cy="148" rx="10" ry="9" fill="#fff8f0" transform="rotate(10 62 148)" />
      <ellipse cx="84" cy="149" rx="10" ry="9" fill="#fff8f0" transform="rotate(-5 84 149)" />
      <path d="M 98 122 Q 115 104 113 86 Q 111 70 105 76" stroke="#f59c42" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="55" cy="83" rx="12" ry="15" fill="#f59c42" transform="rotate(-15 55 83)" />
      <ellipse cx="55" cy="85" rx="8" ry="10" fill="#f5d7b0" transform="rotate(-15 55 85)" />
      <ellipse cx="93" cy="83" rx="12" ry="15" fill="#f59c42" transform="rotate(15 93 83)" />
      <ellipse cx="93" cy="85" rx="8" ry="10" fill="#f5d7b0" transform="rotate(15 93 85)" />
      <ellipse cx="74" cy="94" rx="28" ry="26" fill="#fff8f0" />
      <ellipse cx="74" cy="91" rx="17" ry="16" fill="#f5d7b0" opacity="0.5" />
      <ellipse cx="56" cy="99" rx="8" ry="6" fill="#f0a5a5" opacity="0.6" />
      <ellipse cx="92" cy="99" rx="8" ry="6" fill="#f0a5a5" opacity="0.6" />
      <path d="M 64 91 Q 68 88 72 91" stroke="#2d2d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 76 91 Q 80 88 84 91" stroke="#2d2d3a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="74" cy="99" rx="3.5" ry="2.5" fill="#e8820a" opacity="0.7" />
      <path d="M 70 104 Q 74 107 78 104" stroke="#c87028" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <line x1="40" y1="98" x2="56" y2="100" stroke="#c8a88a" strokeWidth="1.1" opacity="0.55" />
      <line x1="92" y1="100" x2="108" y2="98" stroke="#c8a88a" strokeWidth="1.1" opacity="0.55" />
      <text x="12" y="86" fontSize="10" fill="rgba(150,190,230,0.7)" fontFamily="sans-serif">❄</text>
      <text x="108" y="76" fontSize="8" fill="rgba(150,190,230,0.6)" fontFamily="sans-serif">❄</text>
    </svg>
  );
}

export default function MongiCharacter({ scene, emotion, variant, onTap }: Props) {
  const isBig = variant === "big" || variant === "react";
  const isBounce = variant === "bounce";
  const isSnowIdle = scene === "snow" && variant === "idle";

  return (
    <div
      className={`${styles.mongiWrap} ${isBig ? styles.mongiWrapBig : ""} ${variant === "idle" ? styles.mongiFloat : ""}`}
      onClick={onTap}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onTap?.(); }}
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      aria-label={onTap ? "몽이를 탭하세요" : undefined}
    >
      {isSnowIdle ? (
        <SnowScene emotion={emotion} bounce={isBounce} />
      ) : (
        <MongiBody scene={scene} emotion={emotion} bounce={isBounce} />
      )}
    </div>
  );
}
