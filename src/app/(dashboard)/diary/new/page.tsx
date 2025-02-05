"use client";

import { ProgressBarStandardSFull } from "@/commons/components/progress-bar";
import useDiaryNewPage from "./hook";
import DiaryNewSectionButton from "@/components/home/(dashboard)/diary/new/section-button";
import { CardStandardFullFull } from "@/commons/components/card";
import DiaryNewHeader from "@/components/home/(dashboard)/diary/new/header";
import { FormDiaryNew } from "@/commons/components/form";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function DiaryNewPage() {
  const {
    currentStep,
    isPublic,
    setIsPublic,
    progress,
    isLastStep,
    selectedEmotions,
    setSelectedEmotions,
    handleNext,
    handlePrev,
    DiaryNewStepComponent,
  } = useDiaryNewPage();

  const onSubmit = (data: FormData) => {
    console.log("내가 입력한게 멀까여?", data);
  };

  return (
    <FormDiaryNew
      onSubmit={onSubmit}
      resolver={zodResolver(DiaryNewFormSchema)}
    >
      {/* Header */}
      <DiaryNewHeader
        setIsPublic={setIsPublic}
        isPublic={isPublic}
        selectedEmotions={selectedEmotions}
      />

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <ProgressBarStandardSFull progress={progress} />

        {/* 현재 컴포넌트 */}
        <CardStandardFullFull>
          <DiaryNewStepComponent
            selectedEmotions={selectedEmotions}
            setSelectedEmotions={setSelectedEmotions}
          />
        </CardStandardFullFull>

        {/* 버튼 */}
        <DiaryNewSectionButton
          currentStep={currentStep}
          handleNext={handleNext}
          handlePrev={handlePrev}
          isLastStep={isLastStep}
          isNextButtonEnabled={selectedEmotions.length > 0}
        />
      </div>
    </FormDiaryNew>
  );
}
