"use client";

import { SIGNUP_STEPS } from "@/components/signup/step-progress-section/constants";
import { useState } from "react";

export default function useSignupPage() {
  // 현재 회원가입 단계(0: 기본정보, 1: 프로필설정)
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  // currentStep이 0일 때 50%, 1일 때 100%
  const progress = ((currentStep + 1) / SIGNUP_STEPS.length) * 100;
  return {
    progress,
    currentStepData,
    setCurrentStep,
    isLastStep,
    currentStep,
  };
}
