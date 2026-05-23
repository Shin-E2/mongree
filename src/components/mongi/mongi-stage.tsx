"use client";

import { useEffect, useRef, useState } from "react";
import MongiFigure from "@/components/theme/mongi-figure";
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
  greeting: 2000,
  react_happy: 1800,
  react_soft: 2000,
  reward: 2400,
  celebrate: 3000,
  equip: 1600,
};

export function MongiStage({
  state = "idle",
  onStateEnd,
  className,
  size = 120,
  showXpBurst = false,
  xpGained,
  streakDays,
}: MongiStageProps) {
  const [currentState, setCurrentState] = useState<MongiState>(state);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentState(state);

    if (TRANSIENT_STATES.includes(state)) {
      const duration = STATE_DURATION[state] ?? 2000;
      timeoutRef.current = setTimeout(() => {
        setCurrentState("idle");
        onStateEnd?.();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state, onStateEnd]);

  const effectiveState = isHovered && currentState === "idle" ? "greeting" : currentState;

  return (
    <div
      className={`${styles.stage} ${styles[`state_${effectiveState}`]} ${className ?? ""}`}
      style={{ "--mongi-size": `${size}px` } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      <div className={styles.character}>
        <MongiFigure className={styles.figure} />
      </div>

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
