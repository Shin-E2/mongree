import { FormStandardFullFull } from "@/commons/components/form";
import SignupSectionButton from "../section-button";
import type { ISignupFormSteps } from "./types";
import { signup } from "./hook";
import {
  SignupFormSchema,
  type SignupFormType,
} from "../step-basic-info/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupFormSteps({
  currentStep,
  setCurrentStep,
  currentStepData,
  isLastStep,
}: ISignupFormSteps) {
  // 다음
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // 이전
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 현재 단계의 컴포넌트
  const SignupStepComponent = currentStepData.Component;

  return (
    <FormStandardFullFull<SignupFormType>
      onSubmit={signup}
      resolver={zodResolver(SignupFormSchema)}
    >
      {/* 현재 단계의 컴포넌트 렌더링 */}
      <SignupStepComponent />

      {/* 이전/다음 버튼 */}
      <SignupSectionButton
        currentStep={currentStep}
        handleNext={handleNext}
        isLastStep={isLastStep}
        handlePrev={handlePrev}
      />
    </FormStandardFullFull>
  );
}
