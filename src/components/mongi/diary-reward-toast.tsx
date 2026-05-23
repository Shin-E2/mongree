"use client";

import { useEffect, useState } from "react";
import { MongiStage } from "./mongi-stage";
import styles from "./diary-reward-toast.module.css";

interface DiaryRewardToastProps {
  xpGained?: number;
  streakDays?: number;
  onClose: () => void;
}

export function DiaryRewardToast({ xpGained = 10, streakDays, onClose }: DiaryRewardToastProps) {
  const [phase, setPhase] = useState<"reward" | "idle">("reward");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("idle");
      const closeTimer = setTimeout(onClose, 600);
      return () => clearTimeout(closeTimer);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isStreak = streakDays != null && streakDays >= 3;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.card}>
        <MongiStage
          state={phase}
          size={88}
          showXpBurst
          xpGained={xpGained}
          streakDays={streakDays}
        />
        <div className={styles.message}>
          <p className={styles.title}>
            {isStreak ? `${streakDays}일 연속 기록` : "일기를 남겼어요"}
          </p>
          <p className={styles.sub}>
            {isStreak
              ? "몽이가 기뻐하고 있어요"
              : "오늘 감정을 기록해줘서 고마워요"}
          </p>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="닫기"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
