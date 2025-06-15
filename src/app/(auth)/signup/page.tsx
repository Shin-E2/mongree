"use client";

import { CardStandardFullFull } from "@/commons/components/card";
import SignupStepProgressSection from "@/components/signup/step-progress-section";
import SignupFormSteps from "@/components/signup/form-steps";
import useSignupPage from "./hook";
import AuthPageLayout from "@/components/layout/auth-page-layout";

export default function SignupPage() {
  const {
    progress,
    currentStepData,
    setCurrentStep,
    isLastStep,
    currentStep,
    initialFormData,
    saveTempFormData,
    clearTempFormData,
    isEmailVerified,
  } = useSignupPage();

  return (
    <AuthPageLayout>
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
          initialFormData={initialFormData}
          saveTempFormData={saveTempFormData}
          clearTempFormData={clearTempFormData}
          isEmailConfirmed={isEmailVerified}
        />
      </CardStandardFullFull>
    </AuthPageLayout>
  );
}
