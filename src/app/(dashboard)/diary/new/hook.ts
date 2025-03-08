"use client";

import { useState, useCallback, useMemo } from "react";
import { DIARY_NEW_STEPS } from "../../../../components/home/(dashboard)/diary/new/constants";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";
import { createDiary } from "./action";
import { URL } from "@/commons/constants/global-url";
import { useRouter } from "next/navigation";

export default function useDiaryNewPage() {
  const [currentStep, setCurrentStep] = useState(0); // 현재 단계
  const router = useRouter();

  // 메모이제이션을 통해 불필요한 재계산 방지
  const currentStepData = useMemo(
    () => DIARY_NEW_STEPS[currentStep],
    [currentStep]
  );
  const progress = useMemo(
    () => ((currentStep + 1) / DIARY_NEW_STEPS.length) * 100,
    [currentStep]
  );
  const isLastStep = useMemo(
    () => currentStep === DIARY_NEW_STEPS.length - 1,
    [currentStep]
  );

  // 컴포넌트
  const DiaryNewStepComponent = useMemo(
    () => currentStepData.Component,
    [currentStepData]
  );

  // 다음 버튼 - 콜백으로 최적화
  const handleNext = useCallback(() => {
    setCurrentStep((prevStep) => prevStep + 1);
  }, []);

  // 이전 버튼 - 콜백으로 최적화
  const handlePrev = useCallback(() => {
    setCurrentStep((prevStep) => prevStep - 1);
  }, []);

  // Form 제출 처리 - 콜백으로 최적화
  const onSubmit = useCallback(
    async (data: DiaryNewFormType) => {
      try {
        const formData = new FormData();

        // 기본 데이터 추가
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("isPrivate", String(data.isPrivate));

        // 감정 데이터 추가
        data.emotions.forEach((emotion) => {
          formData.append("emotions", emotion);
        });

        // 태그 데이터 추가
        if (data.tags?.length) {
          formData.append("tags", data.tags.join(","));
        }

        // 이미지 파일 추가
        if (data.images?.length) {
          data.images.forEach((image) => {
            if (image instanceof File) {
              formData.append("images", image);
            }
          });
        }

        const result = await createDiary(formData);

        if (result.success && result.diary) {
          router.push(URL().DIARY_DETAIL(result.diary.id));
        } else {
          alert(result.error || "일기 저장에 실패했습니다");
        }
      } catch (error) {
        console.error("일기 저장 중 오류:", error);
        alert("일기 저장 중 오류가 발생했습니다.");
      }
    },
    [router]
  );

  return {
    currentStep,
    setCurrentStep,
    currentStepData,
    progress,
    isLastStep,
    handleNext,
    handlePrev,
    DiaryNewStepComponent,
    onSubmit,
  };
}
