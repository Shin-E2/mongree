"use client";

import { ProgressBarStandardSFull } from "@/commons/components/progress-bar";
import useDiaryNewPage from "./hook";
import DiaryNewSectionButton from "@/components/home/(dashboard)/diary/new/section-button";
import { CardStandardFullFull } from "@/commons/components/card";
import DiaryNewHeader from "@/components/home/(dashboard)/diary/new/header";
import { FormDiaryNew } from "@/commons/components/form";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmartModal } from "@/commons/components/modal";
import styles from "./styles.module.css";

function DiaryNewPage() {
  const {
    currentStep,
    progress,
    isLastStep,
    isSubmitting,
    modalState,
    handleNext,
    handlePrev,
    DiaryNewStepComponent,
    onSubmit,
    closeModal,
  } = useDiaryNewPage();

  return (
    <>
      <FormDiaryNew
        onSubmit={onSubmit}
        resolver={zodResolver(DiaryNewFormSchema)}
      >
        <DiaryNewHeader />

        <div className={styles.container}>
          <ProgressBarStandardSFull progress={progress} />

          <CardStandardFullFull>
            <DiaryNewStepComponent />
          </CardStandardFullFull>

          <DiaryNewSectionButton
            currentStep={currentStep}
            handleNext={handleNext}
            handlePrev={handlePrev}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </div>
      </FormDiaryNew>

      <SmartModal {...modalState} onClose={closeModal} />
    </>
  );
}

export default DiaryNewPage;
