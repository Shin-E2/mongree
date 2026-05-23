"use client";

import { useEffect, useRef, useState } from "react";
import MongiFigure, { type MongiExpression } from "@/components/theme/mongi-figure";
import { useMongiRive, type MongiTriggerName } from "./use-mongi-rive";
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

const STATE_TO_RIVE_TRIGGER: Partial<Record<MongiState, MongiTriggerName>> = {
  greeting: "greet",
  react_happy: "reactHappy",
  react_soft: "reactSoft",
  reward: "reward",
  celebrate: "celebrate",
  equip: "equipItem",
};

function stateToExpression(state: MongiState, hovered: boolean): MongiExpression {
  const s = hovered && state === "idle" ? "greeting" : state;
  if (s === "sleepy") return "sleepy";
  if (s === "react_soft" || s === "listening") return "soft";
  if (s === "celebrate" || s === "reward" || s === "react_happy") return "excited";
  return "happy";
}

export function MongiStage({
  state = "idle",
  onStateEnd,
  className,
  size = 120,
  showXpBurst = false,
  xpGained,
  streakDays,
  level,
  emotionTone,
}: MongiStageProps) {
  const [currentState, setCurrentState] = useState<MongiState>(state);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { riveAvailable, canvasRef, fireTrigger, setInput } = useMongiRive();

  useEffect(() => {
    setCurrentState(state);

    if (riveAvailable) {
      const trigger = STATE_TO_RIVE_TRIGGER[state];
      if (trigger) fireTrigger(trigger);
    }

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
  }, [state, onStateEnd, riveAvailable, fireTrigger]);

  useEffect(() => {
    if (!riveAvailable) return;
    setInput({ type: "bool", name: "isHovered", value: isHovered });
  }, [isHovered, riveAvailable, setInput]);

  useEffect(() => {
    if (!riveAvailable) return;
    setInput({ type: "bool", name: "isWriting", value: state === "listening" });
  }, [state, riveAvailable, setInput]);

  useEffect(() => {
    if (!riveAvailable) return;
    const hour = new Date().getHours();
    setInput({ type: "bool", name: "isNight", value: hour >= 21 || hour < 6 });
  }, [riveAvailable, setInput]);

  useEffect(() => {
    if (!riveAvailable || level == null) return;
    setInput({ type: "number", name: "level", value: level });
  }, [level, riveAvailable, setInput]);

  useEffect(() => {
    if (!riveAvailable || emotionTone == null) return;
    setInput({ type: "number", name: "emotionTone", value: emotionTone });
  }, [emotionTone, riveAvailable, setInput]);

  useEffect(() => {
    if (!riveAvailable || streakDays == null) return;
    setInput({ type: "number", name: "streakDays", value: streakDays });
  }, [streakDays, riveAvailable, setInput]);

  const effectiveState = isHovered && currentState === "idle" ? "greeting" : currentState;
  const expression = stateToExpression(currentState, isHovered);

  return (
    <div
      className={`${styles.stage} ${!riveAvailable ? styles[`state_${effectiveState}`] : ""} ${className ?? ""}`}
      style={{ "--mongi-size": `${size}px` } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      {riveAvailable ? (
        <canvas
          ref={canvasRef}
          className={styles.riveCanvas}
          style={{ width: size, height: size }}
        />
      ) : (
        <div className={styles.character}>
          <MongiFigure className={styles.figure} expression={expression} />
        </div>
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
