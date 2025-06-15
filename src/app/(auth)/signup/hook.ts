"use client";

import { SIGNUP_STEPS } from "@/components/signup/step-progress-section/constants";
import { useState, useEffect, useCallback } from "react";
import { SignupFormType } from "@/components/signup/step-basic-info/form.schema";
import {
  SESSION_STORAGE_KEY,
  SignupTempFormData,
} from "@/commons/constants/signup";

export default function useSignupPage() {
  const [isEmailVerified, setIsEmailVerified] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("mongree_email_verified") === "true";
    }
    return false;
  });

  const [initialFormData, setInitialFormData] = useState<SignupTempFormData>(
    () => {
      if (typeof window !== "undefined") {
        const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : {};
      }
      return {};
    }
  );

  // 현재 회원가입 단계(0: 기본정보, 1: 프로필설정)
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  // currentStep이 0일 때 50%, 1일 때 100%
  const progress = ((currentStep + 1) / SIGNUP_STEPS.length) * 100;

  // 회원가입 Step 0 데이터 sessionStorage에 임시 저장 (비밀번호 제외)
  const saveTempFormData = useCallback((data: Partial<SignupFormType>) => {
    if (typeof window !== "undefined") {
      const { password, passwordConfirm, profileImage, ...rest } = data;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(rest));
    }
  }, []);

  // sessionStorage 데이터 삭제
  const clearTempFormData = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setInitialFormData({}); // 초기 폼 데이터도 비움
  }, []);

  return {
    progress,
    currentStepData,
    setCurrentStep,
    isLastStep,
    currentStep,
    initialFormData,
    saveTempFormData,
    clearTempFormData,
    isEmailVerified,
  };
}
