"use client";

import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { EMOTIONS } from "@/mock/emotions";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";

export default function DiaryNewStepSelectEmotions() {
  const { setValue, watch } = useFormContext<DiaryNewFormType>();
  const selectedEmotions = watch("emotions") || [];

  const toggleEmotion = (emotionId: string) => {
    const newEmotions = selectedEmotions.includes(emotionId)
      ? selectedEmotions.filter((id) => id !== emotionId)
      : [...selectedEmotions, emotionId];

    setValue("emotions", newEmotions, { shouldValidate: true });
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">오늘의 감정</h2>
      <p className="text-gray-500 mb-6">현재 느끼는 감정을 모두 선택해주세요</p>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {EMOTIONS.map((emotion) => (
          <ButtonOptionEmotion
            key={emotion.id}
            emotion={emotion}
            isSelected={selectedEmotions.includes(emotion.id)}
            onClick={() => toggleEmotion(emotion.id)}
            type="button"
          />
        ))}
      </div>
    </>
  );
}
