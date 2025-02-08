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
    progress,
    isLastStep,
    handleNext,
    handlePrev,
    DiaryNewStepComponent,
    onSubmit,
  } = useDiaryNewPage();

  return (
    <FormDiaryNew
      onSubmit={onSubmit}
      resolver={zodResolver(DiaryNewFormSchema)}
    >
      {/* Header */}
      <DiaryNewHeader />

      <div className="pt-20 pb-12 px-6 max-w-5xl mx-auto">
        {/* Progress Bar */}
        <ProgressBarStandardSFull progress={progress} />

        {/* 현재 컴포넌트 */}
        <CardStandardFullFull>
          <DiaryNewStepComponent />
        </CardStandardFullFull>

        {/* 버튼 */}
        <DiaryNewSectionButton
          currentStep={currentStep}
          handleNext={handleNext}
          handlePrev={handlePrev}
          isLastStep={isLastStep}
        />
      </div>
    </FormDiaryNew>
  );
}
