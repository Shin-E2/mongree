"use client";

import { useEffect, useRef, useState } from "react";
import type { MongiEquippedSlots } from "@/components/theme/mongi-figure";
import { MongiCharacterPng } from "./mongi-character-png";
import { useMongiLottie } from "./use-mongi-lottie";
import styles from "./mongi-stage.module.css";

export type MongiState =
  | "idle"
  | "greeting"
  | "listening"
  | "react_happy"
  | "react_soft"
  | "reward"
  | "sleepy"
  | "celebrate"
  | "equip";

interface MongiStageProps {
  state?: MongiState;
  onStateEnd?: () => void;
  className?: string;
  size?: number;
  showXpBurst?: boolean;
  xpGained?: number;
  streakDays?: number;
  level?: number;
  emotionTone?: number;
  equippedSlots?: MongiEquippedSlots | null;
}

const TRANSIENT_STATES: MongiState[] = [
  "greeting",
  "react_happy",
  "react_soft",
  "reward",
  "celebrate",
  "equip",
];

const STATE_DURATION: Partial<Record<MongiState, number>> = {
  greeting:    2000,
  react_happy: 1800,
  react_soft:  2000,
  reward:      2400,
  celebrate:   3000,
  equip:       1600,
};

export function MongiStage({
  state = "idle",
  onStateEnd,
  className,
  size = 120,
  showXpBurst = false,
  xpGained,
  streakDays,
  equippedSlots,
}: MongiStageProps) {
  const [currentState, setCurrentState] = useState<MongiState>(state);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { lottieAvailable, containerRef, playState } = useMongiLottie();

  useEffect(() => {
    setCurrentState(state);

    if (lottieAvailable) {
      const isTransient = TRANSIENT_STATES.includes(state);
      playState(state, isTransient ? () => {
        setCurrentState("idle");
        onStateEnd?.();
        playState("idle");
      } : undefined);
      // setTimeout 폴백은 Lottie complete 이벤트가 없을 때를 대비
      if (isTransient) {
        const duration = STATE_DURATION[state] ?? 2000;
        timeoutRef.current = setTimeout(() => {
          setCurrentState("idle");
          onStateEnd?.();
        }, duration + 300);
      }
    } else {
      // Lottie 없을 때 CSS 애니메이션 폴백
      if (TRANSIENT_STATES.includes(state)) {
        const duration = STATE_DURATION[state] ?? 2000;
        timeoutRef.current = setTimeout(() => {
          setCurrentState("idle");
          onStateEnd?.();
        }, duration);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state, onStateEnd, lottieAvailable, playState]);

  return (
    <div
      className={`${styles.stage} ${className ?? ""}`}
      style={{ "--mongi-size": `${size}px` } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      {lottieAvailable ? (
        <div
          ref={containerRef}
          className={styles.lottieContainer}
          style={{ width: size, height: size }}
        />
      ) : (
        <MongiCharacterPng
          state={currentState}
          size={size}
          hovered={isHovered}
        />
      )}

      {currentState === "reward" && showXpBurst && (
        <div className={styles.xpBurst} role="status" aria-live="polite">
          {xpGained != null && (
            <span className={styles.xpLabel}>+{xpGained} XP</span>
          )}
          {streakDays != null && streakDays >= 3 && (
            <span className={styles.streakLabel}>{streakDays}일 연속</span>
          )}
        </div>
      )}

      {currentState === "celebrate" && (
        <div className={styles.confetti} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={styles.confettiPiece} />
          ))}
        </div>
      )}
    </div>
  );
}
