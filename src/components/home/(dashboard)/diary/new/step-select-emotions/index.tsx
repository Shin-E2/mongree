"use client";

import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { EMOTION_GROUPS, EMOTIONS } from "@/mock/emotions";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";
import { DIARY_EMOTION_MAX_COUNT } from "../form.schema";
import { useMemo, useCallback, useState } from "react";
import styles from "./styles.module.css";

export default function DiaryNewStepSelectEmotions() {
  const { setValue, watch } = useFormContext<DiaryNewFormType>();
  const watchedEmotions = watch("emotions");
  const selectedEmotions = useMemo(
    () => watchedEmotions ?? [],
    [watchedEmotions]
  );
  const [activeGroupId, setActiveGroupId] = useState(EMOTION_GROUPS[0].id);

  const activeGroup = EMOTION_GROUPS.find((group) => group.id === activeGroupId);
  const groupEmotions = useMemo(
    () => EMOTIONS.filter((emotion) => emotion.groupId === activeGroupId),
    [activeGroupId]
  );
  const selectedEmotionLabels = useMemo(
    () =>
      EMOTIONS.filter((emotion) => selectedEmotions.includes(emotion.id)).map(
        (emotion) => emotion.label
      ),
    [selectedEmotions]
  );

  const toggleEmotion = useCallback(
    (emotionId: string) => {
      const isSelected = selectedEmotions.includes(emotionId);
      const nextEmotions = isSelected
        ? selectedEmotions.filter((id) => id !== emotionId)
        : selectedEmotions.length >= DIARY_EMOTION_MAX_COUNT
          ? selectedEmotions
          : [...selectedEmotions, emotionId];

      setValue("emotions", nextEmotions, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [selectedEmotions, setValue]
  );

  return (
    <>
      <div className={styles.headingArea}>
        <p className={styles.eyebrow}>마음 상태 선택</p>
        <h2 className={styles.title}>오늘 마음에 가까운 감정을 골라주세요</h2>
        <p className={styles.description}>
          감정은 최대 {DIARY_EMOTION_MAX_COUNT}개까지 선택할 수 있어요. 피로, 억울함, 공허함처럼 일상적인 마음도 함께 담았습니다.
        </p>
      </div>

      <div className={styles.groupTabs} aria-label="감정 그룹 선택">
        {EMOTION_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            className={`${styles.groupTab} ${
              activeGroupId === group.id ? styles.groupTabActive : ""
            }`}
            onClick={() => setActiveGroupId(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className={styles.groupSummary}>
        <span className={styles.groupSummaryLabel}>{activeGroup?.label}</span>
        <span className={styles.groupSummaryText}>
          지금 선택한 그룹 안에서 가장 가까운 감정을 골라보세요.
        </span>
      </div>

      <div className={styles.emotionGrid}>
        {groupEmotions.map((emotion) => (
          <ButtonOptionEmotion
            key={emotion.id}
            emotion={emotion}
            isSelected={selectedEmotions.includes(emotion.id)}
            onClick={() => toggleEmotion(emotion.id)}
            type="button"
          />
        ))}
      </div>

      <div className={styles.selectedPanel}>
        <span className={styles.selectedPanelTitle}>
          선택한 감정 {selectedEmotions.length}/{DIARY_EMOTION_MAX_COUNT}
        </span>
        <div className={styles.selectedChips}>
          {selectedEmotionLabels.length > 0 ? (
            selectedEmotionLabels.map((label) => (
              <span key={label} className={styles.selectedChip}>
                {label}
              </span>
            ))
          ) : (
            <span className={styles.emptySelectedText}>아직 선택한 감정이 없습니다.</span>
          )}
        </div>
      </div>
    </>
  );
}