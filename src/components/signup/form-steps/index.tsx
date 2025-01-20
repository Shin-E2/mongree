import { FormStandardFullFull } from "@/commons/components/form";
import SignupSectionButton from "../section-button";
import type { ISignupFormSteps } from "./types";
import {
  SignupFormSchema,
  type SignupFormType,
} from "../step-basic-info/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useSignupFormSteps from "./hook";

export default function SignupFormSteps({
  currentStep,
  setCurrentStep,
  currentStepData,
  isLastStep,
}: ISignupFormSteps) {
  const { handleNext, handlePrev, SignupStepComponent, onSubmit } =
    useSignupFormSteps({
      setCurrentStep,
      currentStepData,
    });

  return (
    <FormStandardFullFull<SignupFormType>
      onSubmit={onSubmit}
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
