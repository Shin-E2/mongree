"use client";

import { useId } from "react";
import styles from "./styles.module.css";

export type MongiExpression = "happy" | "sleepy" | "soft" | "excited";

export interface MongiEquippedSlots {
  head?: string | null;
  neck?: string | null;
  body?: string | null;
  face?: string | null;
}

interface MongiFigureProps {
  className?: string;
  expression?: MongiExpression;
  equippedSlots?: MongiEquippedSlots;
}

// ── 눈 ──────────────────────────────────────────────
function HappyEyes() {
  return (
    <>
      <ellipse cx="70" cy="82" rx="9" ry="9.5" fill="#33303C" />
      <ellipse cx="67" cy="79" rx="3.2" ry="2.8" fill="white" />
      <ellipse cx="73" cy="86" rx="1.5" ry="1.3" fill="white" opacity="0.45" />
      <ellipse cx="110" cy="82" rx="9" ry="9.5" fill="#33303C" />
      <ellipse cx="107" cy="79" rx="3.2" ry="2.8" fill="white" />
      <ellipse cx="113" cy="86" rx="1.5" ry="1.3" fill="white" opacity="0.45" />
    </>
  );
}

function SleepyEyes() {
  return (
    <>
      <path d="M 61 83 Q 70 77 79 83" stroke="#33303C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 101 83 Q 110 77 119 83" stroke="#33303C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 63 82 Q 70 77 77 82" stroke="#33303C" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3" />
      <path d="M 103 82 Q 110 77 117 82" stroke="#33303C" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3" />
    </>
  );
}

function SoftEyes() {
  return (
    <>
      <ellipse cx="70" cy="83" rx="9" ry="8" fill="#33303C" />
      <ellipse cx="67.5" cy="80.5" rx="3" ry="2.5" fill="white" />
      <ellipse cx="110" cy="83" rx="9" ry="8" fill="#33303C" />
      <ellipse cx="107.5" cy="80.5" rx="3" ry="2.5" fill="white" />
      <path d="M 63 87 Q 70 91 77 87" stroke="#F4A8A0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M 103 87 Q 110 91 117 87" stroke="#F4A8A0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
    </>
  );
}

function ExcitedEyes() {
  return (
    <>
      <ellipse cx="70" cy="81" rx="10.5" ry="11" fill="#33303C" />
      <ellipse cx="66.5" cy="77" rx="3.8" ry="3.2" fill="white" />
      <ellipse cx="73" cy="85" rx="2" ry="1.8" fill="white" opacity="0.4" />
      <ellipse cx="110" cy="81" rx="10.5" ry="11" fill="#33303C" />
      <ellipse cx="106.5" cy="77" rx="3.8" ry="3.2" fill="white" />
      <ellipse cx="113" cy="85" rx="2" ry="1.8" fill="white" opacity="0.4" />
    </>
  );
}

// ── 입 ──────────────────────────────────────────────
function HappyMouth() {
  return <path d="M 78 100 Q 84 107 90 100 Q 96 94 102 100" stroke="#C06058" strokeWidth="2.8" fill="none" strokeLinecap="round" />;
}
function SleepyMouth() {
  return <path d="M 82 100 Q 90 103 98 100" stroke="#C06058" strokeWidth="2.2" fill="none" strokeLinecap="round" />;
}
function SoftMouth() {
  return <path d="M 82 101 Q 90 105 98 101" stroke="#C06058" strokeWidth="2.2" fill="none" strokeLinecap="round" />;
}
function ExcitedMouth() {
  return <path d="M 75 99 Q 83 109 90 103 Q 97 109 105 99" stroke="#C06058" strokeWidth="3" fill="none" strokeLinecap="round" />;
}

// ── 머리 아이템 (viewBox 0 0 180 200, 머리 top ≈ y=36) ──
function HeadAccessory({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "mongi_default_leaf_hat":
      return (
        <g>
          <line x1="90" y1="36" x2="90" y2="22" stroke="#5D9B3A" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="82" cy="22" rx="9" ry="5.5" fill="#6DC44F" transform="rotate(-25 82 22)" />
          <ellipse cx="98" cy="20" rx="8" ry="5" fill="#81D464" transform="rotate(20 98 20)" />
          <circle cx="90" cy="23" r="2.5" fill="#4CAF50" />
        </g>
      );
    case "mongi_ribbon_pin":
      return (
        <g>
          <path d="M 44 62 Q 36 54 42 47 Q 48 40 52 49 Q 54 56 48 62 Z" fill="#FFB6C8" />
          <path d="M 52 62 Q 60 54 54 47 Q 48 40 44 49 Q 42 56 48 62 Z" fill="#FF8FAF" />
          <circle cx="48" cy="54" r="4.5" fill="#FFD0DE" />
          <circle cx="48" cy="54" r="2" fill="#FF8FAF" />
        </g>
      );
    case "mongi_flower_hat":
      return (
        <g>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx={90 + 9 * Math.cos((deg * Math.PI) / 180)}
              cy={28 + 9 * Math.sin((deg * Math.PI) / 180)}
              rx="6"
              ry="4"
              fill="#FFB6C8"
              transform={`rotate(${deg} ${90 + 9 * Math.cos((deg * Math.PI) / 180)} ${28 + 9 * Math.sin((deg * Math.PI) / 180)})`}
            />
          ))}
          <circle cx="90" cy="28" r="5" fill="#FFE066" />
        </g>
      );
    case "mongi_crown":
      return (
        <g>
          <path d="M 62 50 L 68 33 L 76 46 L 84 30 L 90 44 L 96 30 L 104 46 L 112 33 L 118 50 Z" fill="#FFD700" stroke="#C8A000" strokeWidth="1.5" />
          <rect x="62" y="48" width="56" height="8" rx="2" fill="#FFD700" stroke="#C8A000" strokeWidth="1" />
          <circle cx="76" cy="50" r="3" fill="#FF6B6B" />
          <circle cx="90" cy="50" r="3" fill="#74BCFF" />
          <circle cx="104" cy="50" r="3" fill="#74FF7A" />
        </g>
      );
    case "mongi_star_clip":
      return (
        <g>
          <path
            d="M 132 60 L 134 52 L 136 60 L 144 60 L 137 64 L 140 72 L 132 67 L 124 72 L 127 64 L 120 60 Z"
            fill="#FFD700"
            stroke="#D4A000"
            strokeWidth="1"
          />
        </g>
      );
    default:
      return null;
  }
}

// ── 얼굴 아이템 (눈 위치: cx=70/110, cy=82) ──
function FaceAccessory({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "mongi_glasses":
      return (
        <g>
          <circle cx="70" cy="82" r="11" fill="none" stroke="#5A4A3A" strokeWidth="2.2" opacity="0.85" />
          <circle cx="110" cy="82" r="11" fill="none" stroke="#5A4A3A" strokeWidth="2.2" opacity="0.85" />
          <line x1="81" y1="82" x2="99" y2="82" stroke="#5A4A3A" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <line x1="36" y1="80" x2="59" y2="82" stroke="#5A4A3A" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <line x1="121" y1="82" x2="144" y2="80" stroke="#5A4A3A" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        </g>
      );
    default:
      return null;
  }
}

// ── 목 아이템 (cy ≈ 130~145) ──
function NeckAccessory({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "mongi_default_scarf":
      return (
        <g>
          <path d="M 52 136 Q 90 128 128 136 Q 90 144 52 136 Z" fill="#FFB347" opacity="0.92" />
          <rect x="82" y="136" width="16" height="22" rx="5" fill="#FFB347" opacity="0.92" />
          <line x1="86" y1="138" x2="86" y2="156" stroke="#E8940A" strokeWidth="1.2" opacity="0.4" />
          <line x1="94" y1="138" x2="94" y2="156" stroke="#E8940A" strokeWidth="1.2" opacity="0.4" />
        </g>
      );
    case "mongi_bow_tie":
      return (
        <g>
          <path d="M 78 136 Q 70 128 76 122 Q 82 116 86 124 Q 88 130 82 136 Z" fill="#FF6B6B" />
          <path d="M 102 136 Q 110 128 104 122 Q 98 116 94 124 Q 92 130 98 136 Z" fill="#E85555" />
          <path d="M 82 136 Q 86 130 90 130 Q 94 130 98 136 Q 94 138 90 136 Q 86 138 82 136 Z" fill="#FF8080" />
          <circle cx="90" cy="128" r="4.5" fill="#FF9999" />
        </g>
      );
    case "mongi_bell_collar":
      return (
        <g>
          <path d="M 48 136 Q 90 128 132 136" stroke="#C8965A" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 48 136 Q 90 130 132 136" stroke="#D4A870" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="90" cy="145" rx="7.5" ry="9" fill="#D4AF37" />
          <ellipse cx="90" cy="149" rx="5.5" ry="4.5" fill="#C09A2A" />
          <circle cx="90" cy="142" r="1.5" fill="#8B6914" />
          <line x1="90" y1="151" x2="90" y2="154" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "mongi_scarf":
      return (
        <g>
          <path d="M 50 136 Q 90 128 130 136 Q 90 144 50 136 Z" fill="#7EC8E3" opacity="0.92" />
          <line x1="60" y1="132" x2="60" y2="140" stroke="#4FA8C8" strokeWidth="2.5" opacity="0.5" />
          <line x1="72" y1="130" x2="72" y2="142" stroke="#4FA8C8" strokeWidth="2.5" opacity="0.5" />
          <line x1="84" y1="129" x2="84" y2="143" stroke="#4FA8C8" strokeWidth="2.5" opacity="0.5" />
          <line x1="96" y1="129" x2="96" y2="143" stroke="#4FA8C8" strokeWidth="2.5" opacity="0.5" />
          <line x1="108" y1="130" x2="108" y2="142" stroke="#4FA8C8" strokeWidth="2.5" opacity="0.5" />
          <line x1="120" y1="132" x2="120" y2="140" stroke="#4FA8C8" strokeWidth="2.5" opacity="0.5" />
          <rect x="78" y="136" width="18" height="24" rx="5" fill="#7EC8E3" opacity="0.92" />
        </g>
      );
    default:
      return null;
  }
}

// ── 바디 아이템 (cx=90, cy=155~175) ──
function BodyAccessory({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "mongi_default_star_badge":
      return (
        <g>
          <path
            d="M 68 154 L 70.5 147 L 73 154 L 80 154 L 74.5 158 L 77 165 L 70.5 161 L 64 165 L 66.5 158 L 61 154 Z"
            fill="#FFD700"
            stroke="#C8A000"
            strokeWidth="0.8"
          />
          <circle cx="70.5" cy="156" r="2.5" fill="#FFF8B0" opacity="0.6" />
        </g>
      );
    case "mongi_heart_badge":
      return (
        <g>
          <path
            d="M 90 172 Q 75 162 72 155 Q 69 148 76 146 Q 83 144 90 151 Q 97 144 104 146 Q 111 148 108 155 Q 105 162 90 172 Z"
            fill="#FF6B6B"
            opacity="0.9"
          />
          <path
            d="M 90 169 Q 77 160 74 154 Q 72 149 78 148 Q 85 147 90 153 Q 95 147 102 148 Q 108 149 106 154 Q 103 160 90 169 Z"
            fill="#FF9999"
            opacity="0.5"
          />
        </g>
      );
    case "mongi_rainbow_cape":
      return (
        <g>
          <path d="M 52 142 Q 26 175 30 198 Q 90 202 150 198 Q 154 175 128 142 Q 90 148 52 142 Z" fill="#FF6B6B" opacity="0.65" />
          <path d="M 54 150 Q 90 146 126 150" stroke="#FF9F1C" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M 50 160 Q 90 155 130 160" stroke="#FFEC5C" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M 46 170 Q 90 164 134 170" stroke="#6BCB77" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M 42 180 Q 90 174 138 180" stroke="#74BCFF" strokeWidth="3" fill="none" opacity="0.7" />
        </g>
      );
    default:
      return null;
  }
}

export default function MongiFigure({ className, expression = "happy", equippedSlots }: MongiFigureProps) {
  const id = useId();
  const bodyGrad = `${id}-body`;
  const faceGrad = `${id}-face`;
  const shadowGrad = `${id}-shadow`;

  return (
    <svg
      className={`${styles.figure} ${className ?? ""}`}
      viewBox="0 0 180 200"
      role="img"
      aria-label="몽이"
      focusable="false"
    >
      <defs>
        <radialGradient id={bodyGrad} cx="42%" cy="35%" r="62%">
          <stop offset="0%" stopColor="#FFFAF4" />
          <stop offset="55%" stopColor="#F7DFC8" />
          <stop offset="100%" stopColor="#EDD4BC" />
        </radialGradient>
        <radialGradient id={faceGrad} cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="100%" stopColor="#F5D8C0" />
        </radialGradient>
        <radialGradient id={shadowGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B89070" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#B89070" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="90" cy="190" rx="52" ry="9" fill={`url(#${shadowGrad})`} />

      {/* Body item (cape goes behind body) */}
      {equippedSlots?.body && <BodyAccessory itemId={equippedSlots.body} />}

      {/* Tail */}
      <path
        className={styles.tail}
        d="M 120 160 Q 158 138 150 110 Q 144 92 130 98"
        stroke="#EDD4BC"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 120 160 Q 154 140 147 113 Q 142 97 132 101"
        stroke="#F7DFC8"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Body */}
      <ellipse className={styles.body} cx="90" cy="162" rx="42" ry="34" fill={`url(#${bodyGrad})`} />
      <ellipse cx="90" cy="165" rx="26" ry="20" fill="#F5D5BC" opacity="0.4" />

      {/* Paws */}
      <ellipse cx="65" cy="182" rx="18" ry="11" fill="#FFF8F0" />
      <ellipse cx="115" cy="182" rx="18" ry="11" fill="#FFF8F0" />
      <ellipse cx="58" cy="186" rx="5" ry="3.2" fill="#ECC8B0" opacity="0.55" />
      <ellipse cx="66" cy="187" rx="5" ry="3.2" fill="#ECC8B0" opacity="0.55" />
      <ellipse cx="74" cy="186" rx="5" ry="3.2" fill="#ECC8B0" opacity="0.55" />
      <ellipse cx="108" cy="186" rx="5" ry="3.2" fill="#ECC8B0" opacity="0.55" />
      <ellipse cx="116" cy="187" rx="5" ry="3.2" fill="#ECC8B0" opacity="0.55" />
      <ellipse cx="124" cy="186" rx="5" ry="3.2" fill="#ECC8B0" opacity="0.55" />

      {/* Left ear */}
      <path d="M 36 80 L 54 34 L 80 72" fill="#EDD0BA" />
      <path d="M 42 76 L 57 42 L 75 69" fill="#FFBDAA" />

      {/* Right ear */}
      <path d="M 144 80 L 126 34 L 100 72" fill="#EDD0BA" />
      <path d="M 138 76 L 123 42 L 105 69" fill="#FFBDAA" />

      {/* Neck accessory (behind head) */}
      {equippedSlots?.neck && <NeckAccessory itemId={equippedSlots.neck} />}

      {/* Head */}
      <ellipse className={styles.head} cx="90" cy="88" rx="54" ry="52" fill={`url(#${faceGrad})`} />

      {/* Face shading */}
      <ellipse cx="90" cy="92" rx="34" ry="30" fill="#F5D5BC" opacity="0.28" />

      {/* Blush */}
      <ellipse className={styles.blush} cx="54" cy="98" rx="14" ry="9" fill="#FFAAA0" opacity="0.38" />
      <ellipse className={styles.blush} cx="126" cy="98" rx="14" ry="9" fill="#FFAAA0" opacity="0.38" />

      {/* Eyes */}
      {expression === "happy" && <HappyEyes />}
      {expression === "sleepy" && <SleepyEyes />}
      {expression === "soft" && <SoftEyes />}
      {expression === "excited" && <ExcitedEyes />}

      {/* Nose */}
      <path d="M 87 94 L 90 99 L 93 94 Z" fill="#D07870" />
      <line x1="90" y1="99" x2="90" y2="101" stroke="#D07870" strokeWidth="1.8" strokeLinecap="round" />

      {/* Mouth */}
      {expression === "happy" && <HappyMouth />}
      {expression === "sleepy" && <SleepyMouth />}
      {expression === "soft" && <SoftMouth />}
      {expression === "excited" && <ExcitedMouth />}

      {/* Face accessory (glasses, over eyes) */}
      {equippedSlots?.face && <FaceAccessory itemId={equippedSlots.face} />}

      {/* Whiskers left */}
      <line x1="24" y1="90" x2="66" y2="93" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="24" y1="96" x2="66" y2="96" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="26" y1="102" x2="66" y2="99" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />

      {/* Whiskers right */}
      <line x1="156" y1="90" x2="114" y2="93" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="156" y1="96" x2="114" y2="96" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="154" y1="102" x2="114" y2="99" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />

      {/* Head accessory (on top, rendered last = on top) */}
      {equippedSlots?.head && <HeadAccessory itemId={equippedSlots.head} />}
    </svg>
  );
}
