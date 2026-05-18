"use client";

import { useCallback, useState } from "react";
import { SIGNUP_STEPS } from "@/components/signup/step-progress-section/constants";
import { SignupFormType } from "@/components/signup/step-basic-info/form.schema";
import {
  SESSION_STORAGE_KEY,
  SignupTempFormData,
} from "@/commons/constants/signup";

export default function useSignupPage() {
  const [isEmailVerified] = useState(() => {
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

  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  const progress = ((currentStep + 1) / SIGNUP_STEPS.length) * 100;

  const saveTempFormData = useCallback((data: Partial<SignupFormType>) => {
    if (typeof window !== "undefined") {
      const rest = { ...data };
      delete rest.password;
      delete rest.passwordConfirm;
      delete rest.profileImage;

      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(rest));
    }
  }, []);

  const clearTempFormData = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setInitialFormData({});
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
