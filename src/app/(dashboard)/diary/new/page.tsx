"use client";

import { ProgressBarStandardSFull } from "@/commons/components/progress-bar";
import useDiaryNewPage from "./hook";
import DiaryNewSectionButton from "@/components/home/(dashboard)/diary/new/section-button";
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
        mode="onChange"
      >
        <div className={styles.pageShell}>
          <DiaryNewHeader isSubmitting={isSubmitting} />

          <main className={styles.container}>
            <section className={styles.introPanel}>
              <span className={styles.eyebrow}>오늘의 기록</span>
              <h1 className={styles.title}>
                지금 마음에 가까운 감정을 골라주세요
              </h1>
              <p className={styles.description}>
                감정은 여러 개여도 괜찮아요. 짧은 문장으로 시작해도 오늘의
                흐름을 남기기에는 충분합니다.
              </p>
            </section>

            <div className={styles.progressWrapper}>
              <ProgressBarStandardSFull progress={progress} />
            </div>

            <section className={styles.formPanel}>
              <DiaryNewStepComponent />
            </section>

            <DiaryNewSectionButton
              currentStep={currentStep}
              handleNext={handleNext}
              handlePrev={handlePrev}
              isLastStep={isLastStep}
              isSubmitting={isSubmitting}
            />
          </main>
        </div>
      </FormDiaryNew>

      <SmartModal {...modalState} onClose={closeModal} />
    </>
  );
}

export default DiaryNewPage;
