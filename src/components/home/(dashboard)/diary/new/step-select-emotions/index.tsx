"use client";

import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { EMOTIONS } from "@/mock/emotions";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";
import { useMemo, useCallback } from "react";

export default function DiaryNewStepSelectEmotions() {
  const { setValue, watch } = useFormContext<DiaryNewFormType>();
  const selectedEmotions = watch("emotions") || [];

  // 감정 토글 함수를 메모이제이션하여 불필요한 재생성 방지
  const toggleEmotion = useCallback(
    (emotionId: string) => {
      const newEmotions = selectedEmotions.includes(emotionId)
        ? selectedEmotions.filter((id) => id !== emotionId)
        : [...selectedEmotions, emotionId];

      // shouldValidate 옵션을 필요한 경우에만 true로 설정
      setValue("emotions", newEmotions, {
        shouldValidate: false,
        shouldDirty: true,
      });
    },
    [selectedEmotions, setValue]
  );

  // 감정 버튼 목록을 메모이제이션하여 불필요한 재렌더링 방지
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
      <h2 className="text-lg font-semibold mb-2">오늘의 감정</h2>
      <p className="text-gray-500 mb-6">현재 느끼는 감정을 모두 선택해주세요</p>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {emotionButtons}
      </div>
    </>
  );
}
