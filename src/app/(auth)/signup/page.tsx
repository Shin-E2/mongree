"use client";

import { CardStandardFullFull } from "@/commons/components/card";
import SignupSectionButton from "@/components/signup/section-button";
import SignupStepProgressSection from "@/components/signup/step-progress-section";
import { SIGNUP_STEPS } from "@/components/signup/step-progress-section/constants";
import styles from "./styles.module.css";

import { useState } from "react";

export default function SignupPage() {
  // 현재 회원가입 단계(0: 기본정보, 1: 프로필설정)
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  // currentStep이 0일 때 50%, 1일 때 100%
  const progress = ((currentStep + 1) / SIGNUP_STEPS.length) * 100;

  // 다음
  const handleNext = () => {
    // 다음 단계로 이동
    setCurrentStep((prev) => prev + 1);
  };

  // 이전
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 현재 단계의 컴포넌트
  const SignupStepComponent = currentStepData.Component;

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
          <form className="space-y-6">
            {/* 현재 단계의 컴포넌트 렌더링 */}
            <SignupStepComponent />

            {/* 이전/다음 버튼 */}
            <SignupSectionButton
              currentStep={currentStep}
              handleNext={handleNext}
              isLastStep={isLastStep}
              handlePrev={handlePrev}
            />
          </form>
        </CardStandardFullFull>
      </div>
    </section>
  );
}
