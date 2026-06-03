"use client";

import { useEffect, useState } from "react";
import { MongiStage } from "@/components/mongi/mongi-stage";
import type { MongiState } from "@/components/mongi/mongi-stage";
import styles from "./styles.module.css";

interface MongiWidgetProps {
  primaryEmotionLabel?: string;
  diaryCount: number;
}

export function MongiWidget({ primaryEmotionLabel, diaryCount }: MongiWidgetProps) {
  const [mongiState, setMongiState] = useState<MongiState>("idle");
  const hour = new Date().getHours();
  const isSleepy = hour < 7 || hour >= 23;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMongiState(isSleepy ? "sleepy" : "greeting");
      const resetTimer = setTimeout(() => setMongiState(isSleepy ? "sleepy" : "idle"), 2000);
      return () => clearTimeout(resetTimer);
    }, 400);
    return () => clearTimeout(timer);
  }, [isSleepy]);

  return (
    <div className={styles.heroWidget}>
      <div className={styles.mongiOrb}>
        <MongiStage
          state={mongiState}
          onStateEnd={() => setMongiState(isSleepy ? "sleepy" : "idle")}
          size={160}
        />
      </div>
      <div className={styles.heroMetricRow}>
        <div>
          <span className={styles.metricLabel}>이번 달 대표 감정</span>
          <strong className={styles.metricValue}>
            {primaryEmotionLabel ?? "아직 없어요"}
          </strong>
        </div>
        <div>
          <span className={styles.metricLabel}>최근 기록</span>
          <strong className={styles.metricValue}>{diaryCount}개</strong>
        </div>
      </div>
    </div>
  );
}
