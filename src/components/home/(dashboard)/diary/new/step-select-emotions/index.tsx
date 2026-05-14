"use client";

import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { EMOTIONS } from "@/mock/emotions";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";
import { useMemo, useCallback } from "react";
import styles from "./styles.module.css";

export default function DiaryNewStepSelectEmotions() {
  const { setValue, watch } = useFormContext<DiaryNewFormType>();
  const watchedEmotions = watch("emotions");
  const selectedEmotions = useMemo(
    () => watchedEmotions ?? [],
    [watchedEmotions]
  );

  const toggleEmotion = useCallback(
    (emotionId: string) => {
      const nextEmotions = selectedEmotions.includes(emotionId)
        ? selectedEmotions.filter((id) => id !== emotionId)
        : [...selectedEmotions, emotionId];

      setValue("emotions", nextEmotions, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [selectedEmotions, setValue]
  );

  const emotionButtons = useMemo(() => {
    return EMOTIONS.map((emotion) => (
      <ButtonOptionEmotion
        key={emotion.id}
        emotion={emotion}
        isSelected={selectedEmotions.includes(emotion.id)}
        onClick={() => toggleEmotion(emotion.id)}
        type="button"
      />
    ));
  }, [selectedEmotions, toggleEmotion]);

  return (
    <>
      <h2 className={styles.title}>오늘의 감정</h2>
      <p className={styles.description}>
        지금 마음에 가까운 감정을 모두 선택해주세요.
      </p>

      <div className={styles.emotionGrid}>{emotionButtons}</div>
    </>
  );
}
