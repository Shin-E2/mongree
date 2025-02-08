import { useState } from "react";
import { DIARY_NEW_STEPS } from "../../../../components/home/(dashboard)/diary/new/constants";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";
import { createDiary } from "./action";

export default function useDiaryNewPage() {
  const [currentStep, setCurrentStep] = useState(0); // 현재 단계

  const currentStepData = DIARY_NEW_STEPS[currentStep];
  const progress = ((currentStep + 1) / DIARY_NEW_STEPS.length) * 100;
  const isLastStep = currentStep === DIARY_NEW_STEPS.length - 1;

  // 컴포넌트
  const DiaryNewStepComponent = currentStepData.Component;

  // 다음 버튼
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  // 이전 버튼
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: DiaryNewFormType) => {
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

      // 이미지 파일 추가 - 로깅 추가
      if (data.images?.length) {
        console.log("이미지 업로드 시작:", data.images); // 디버깅용
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            console.log(`이미지 ${index} 추가:`, image.name); // 디버깅용
            formData.append("images", image);
          }
        });
      }

      const result = await createDiary(formData);

      if (result.success) {
        console.log("일기 저장 성공:", result);
      } else {
        console.error("저장 실패 상세:", result); // 더 자세한 에러 정보
        alert(result.error);
      }
    } catch (error) {
      console.error("전체 에러:", error); // 전체 에러 로깅
      alert("일기 저장 중 오류가 발생했습니다.");
    }
  };

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
