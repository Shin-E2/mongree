"use client";

import { useId } from "react";
import styles from "./styles.module.css";

export type MongiExpression = "happy" | "sleepy" | "soft" | "excited";

interface MongiFigureProps {
  className?: string;
  expression?: MongiExpression;
}

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

export default function MongiFigure({ className, expression = "happy" }: MongiFigureProps) {
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

      {/* Left ear (back layer) */}
      <path d="M 36 80 L 54 34 L 80 72" fill="#EDD0BA" />
      <path d="M 42 76 L 57 42 L 75 69" fill="#FFBDAA" />

      {/* Right ear (back layer) */}
      <path d="M 144 80 L 126 34 L 100 72" fill="#EDD0BA" />
      <path d="M 138 76 L 123 42 L 105 69" fill="#FFBDAA" />

      {/* Head */}
      <ellipse className={styles.head} cx="90" cy="88" rx="54" ry="52" fill={`url(#${faceGrad})`} />

      {/* Face shading (inner warm glow) */}
      <ellipse cx="90" cy="92" rx="34" ry="30" fill="#F5D5BC" opacity="0.28" />

      {/* Blush left */}
      <ellipse className={styles.blush} cx="54" cy="98" rx="14" ry="9" fill="#FFAAA0" opacity="0.38" />
      {/* Blush right */}
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

      {/* Whiskers left */}
      <line x1="24" y1="90" x2="66" y2="93" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="24" y1="96" x2="66" y2="96" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="26" y1="102" x2="66" y2="99" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />

      {/* Whiskers right */}
      <line x1="156" y1="90" x2="114" y2="93" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="156" y1="96" x2="114" y2="96" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
      <line x1="154" y1="102" x2="114" y2="99" stroke="#C8A888" strokeWidth="1.4" opacity="0.48" strokeLinecap="round" />
    </svg>
  );
}
