"use client";

import { CardStandardFullFull } from "@/commons/components/card";
import SignupStepProgressSection from "@/components/signup/step-progress-section";
import { SIGNUP_STEPS } from "@/components/signup/step-progress-section/constants";
import styles from "./styles.module.css";

import { useState } from "react";
import SignupFormSteps from "@/components/signup/form-steps";

export default function SignupPage() {
  // 현재 회원가입 단계(0: 기본정보, 1: 프로필설정)
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  // currentStep이 0일 때 50%, 1일 때 100%
  const progress = ((currentStep + 1) / SIGNUP_STEPS.length) * 100;

  return (
    <section className={styles.section}>
      <div className={styles.section_div}>
        {/* 진행 단계 표시 영역 */}
        <SignupStepProgressSection
          progress={progress}
          currentStepData={currentStepData}
        />

        {/* 폼 영역 */}
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
