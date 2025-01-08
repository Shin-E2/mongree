import { SIGNUP_STEPS } from "./constants";
import styles from "./styles.module.css";
import { ProgressBarStandardSFull } from "@/commons/components/progress-bar";
import type { IstepProgressSectionProps } from "./types";
import { StepIndicatorStandardMM } from "@/commons/components/step-indicator";

export default function SignupStepProgressSection({
  progress,
  currentStepData,
}: IstepProgressSectionProps) {
  return (
    <section>
      {/* 단계 인디케이터 */}
      <div className={styles.section_div}>
        {SIGNUP_STEPS.map((step) => (
          <StepIndicatorStandardMM
            key={step.id}
            label={step.label}
            step={step.id}
            currentStep={currentStepData.id}
          />
        ))}
      </div>
      {/* 진행 상태 바 */}
      <ProgressBarStandardSFull progress={progress} />
    </section>
  );
}
