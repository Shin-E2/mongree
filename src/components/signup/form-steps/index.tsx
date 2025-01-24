import { FormStandardFullFull } from "@/commons/components/form";
import SignupSectionButton from "../section-button";
import type { ISignupFormSteps } from "./types";
import {
  SignupFormSchema,
  type SignupFormType,
} from "../step-basic-info/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useSignupFormSteps from "./hook";
import { ModalStandardFitFit } from "@/commons/components/modal";

export default function SignupFormSteps({
  currentStep,
  setCurrentStep,
  currentStepData,
  isLastStep,
}: ISignupFormSteps) {
  const {
    handleNext,
    handlePrev,
    SignupStepComponent,
    onSubmit,
    handleOk,
    isOpen,
    // isNextButtonEnabled,
  } = useSignupFormSteps({
    setCurrentStep,
    currentStepData,
  });

  return (
    <>
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
          // isNextButtonEnabled={isNextButtonEnabled}
        />
      </FormStandardFullFull>
      {isOpen && (
        <ModalStandardFitFit
          title="회원가입 완료 ✅"
          discription={`지금 바로 로그인을 하여 \n 나만의 일기를 작성해보세요!`}
          okButton={{ text: "확인", onClick: handleOk }}
        />
      )}
    </>
  );
}
