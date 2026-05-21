"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import type { MongreeThemeScene, MongiEmotion } from "@/components/theme/theme.types";
import MongiCharacter from "./mongi-character";
import EmotionCloud from "./emotion-cloud";
import DiaryFloat from "./diary-float";
import AuthBottomSheet from "./auth-bottom-sheet";
import styles from "./styles.module.css";

type LandingStep = 1 | 2 | 3 | 4 | 5;

const SCENES: MongreeThemeScene[] = ["day", "rain", "snow", "night"];
const SCENE_CYCLE_MS = 4200;
const BUBBLE_VISIBLE_MS = 1200;

export default function WelcomeHeroSection() {
  const { setScene } = useMongreeTheme();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<LandingStep>(1);
  const [selectedEmotion, setSelectedEmotion] = useState<MongiEmotion | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setScene(SCENES[sceneIdx]);
  }, [sceneIdx, setScene]);

  const stopCycle = useCallback(() => {
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
  }, []);

  const startCycle = useCallback(() => {
    stopCycle();
    cycleRef.current = setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % SCENES.length);
    }, SCENE_CYCLE_MS);
  }, [stopCycle]);

  useEffect(() => {
    if (step === 1) {
      startCycle();
    } else {
      stopCycle();
    }
    return stopCycle;
  }, [step, startCycle, stopCycle]);

  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    };
  }, []);

  const handleMongiTap = useCallback(() => {
    if (step !== 1) return;
    setStep(2);
    bounceTimerRef.current = setTimeout(() => {
      setStep(3);
    }, BUBBLE_VISIBLE_MS);
  }, [step]);

  const handleEmotionSelect = useCallback((emotion: MongiEmotion) => {
    setSelectedEmotion(emotion);
    sessionStorage.setItem("prefill_emotion", emotion);
    setTimeout(() => setStep(4), 300);
  }, []);

  const handleDiaryTap = useCallback(() => {
    setStep(5);
  }, []);

  const handleSheetClose = useCallback(() => {
    setStep(1);
  }, []);

  const mongiVariant = (() => {
    if (step === 1) return "idle" as const;
    if (step === 2) return "bounce" as const;
    if (step === 3) return "big" as const;
    return "react" as const;
  })();

  return (
    <section className={`${styles.section} ${mounted ? styles.mounted : ""}`}>
      <div className={styles.inner}>

        {(step === 1 || step === 2) && (
          <div className={styles.textBlock}>
            <h1 className={styles.headline}>몽그리</h1>
            <p className={styles.sub}>감정을 담는 나만의 공간</p>
          </div>
        )}

        {step === 3 && (
          <EmotionCloud
            selectedEmotion={selectedEmotion}
            onSelect={handleEmotionSelect}
          />
        )}

        {step !== 5 && (
          <div className={styles.characterWrap}>
            {step === 2 && (
              <div className={styles.speechBubble} role="status" aria-live="polite">
                너의 이야기가 궁금해! 🐾
              </div>
            )}

            <MongiCharacter
              scene={SCENES[sceneIdx]}
              emotion={selectedEmotion}
              variant={mongiVariant}
              onTap={step === 1 ? handleMongiTap : undefined}
            />

            {step === 1 && (
              <p className={styles.tapHint} aria-hidden="true">탭해 보세요 🐾</p>
            )}
          </div>
        )}

        {step === 4 && selectedEmotion && (
          <DiaryFloat emotion={selectedEmotion} onTap={handleDiaryTap} />
        )}

        {step === 5 && (
          <AuthBottomSheet onClose={handleSheetClose} />
        )}

        {step === 1 && (
          <div className={styles.dots} aria-hidden="true">
            {SCENES.map((s, i) => (
              <button
                key={s}
                type="button"
                className={`${styles.dot} ${i === sceneIdx ? styles.dotActive : ""}`}
                onClick={() => setSceneIdx(i)}
                aria-label={`${s} 장면`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
