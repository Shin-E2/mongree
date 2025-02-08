"use client";

import { CardStandardFullFull } from "@/commons/components/card";
import SignupStepProgressSection from "@/components/signup/step-progress-section";
import styles from "./styles.module.css";
import SignupFormSteps from "@/components/signup/form-steps";
import useSignupPage from "./hook";

export default function SignupPage() {
  const { progress, currentStepData, setCurrentStep, isLastStep, currentStep } =
    useSignupPage();

  return (
    <section className={styles.section}>
      <div className={styles.section_div}>
        <SignupStepProgressSection
          progress={progress}
          currentStepData={currentStepData}
        />
        <CardStandardFullFull>
          <SignupFormSteps
            currentStepData={currentStepData}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            isLastStep={isLastStep}
          />
        </CardStandardFullFull>
      </div>
    </section>
  );
}
