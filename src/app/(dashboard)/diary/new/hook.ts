import { useState } from "react";
import { DIARY_NEW_STEPS } from "../../../../components/home/(dashboard)/diary/new/constants";

export default function useDiaryNewPage() {
  const [currentStep, setCurrentStep] = useState(0); // 현재 단계
  const [isPublic, setIsPublic] = useState(true); // 공개, 비공개

  const currentStepData = DIARY_NEW_STEPS[currentStep];
  const progress = ((currentStep + 1) / DIARY_NEW_STEPS.length) * 100;
  const isLastStep = currentStep === DIARY_NEW_STEPS.length - 1;

  // 선택한 감정
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

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

  return {
    currentStep,
    setCurrentStep,
    isPublic,
    setIsPublic,
    currentStepData,
    progress,
    isLastStep,
    selectedEmotions,
    setSelectedEmotions,
    handleNext,
    handlePrev,
    DiaryNewStepComponent,
  };
}
