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
import { useState, useEffect } from "react";
import SignupStepBasicInfo from "../step-basic-info";

export default function SignupFormSteps({
  currentStep,
  setCurrentStep,
  currentStepData,
  isLastStep,
  initialFormData,
  saveTempFormData,
  clearTempFormData,
  isEmailConfirmed,
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
    initialFormData,
  });

  // 기본정보 스텝에서 이메일/닉네임 인증 상태 관리
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // 다음 버튼 활성화 조건: 기본정보 스텝(0)일 때만 체크
  const isNextButtonEnabled =
    currentStep === 0 ? isEmailConfirmed && isNicknameChecked : true;

  // 회원가입 완료 시 sessionStorage 데이터 삭제
  useEffect(() => {
    if (isLastStep && isOpen) {
      clearTempFormData();
    }
  }, [currentStep, isLastStep, isOpen, clearTempFormData]);

  return (
    <>
      <FormStandardFullFull<SignupFormType>
        onSubmit={onSubmit}
        resolver={zodResolver(SignupFormSchema)}
        defaultValues={initialFormData}
      >
        {/* 기본정보 스텝에만 인증 상태 콜백 전달 */}
        {currentStep === 0 ? (
          <SignupStepBasicInfo
            onNicknameChecked={setIsNicknameChecked}
            initialFormData={initialFormData}
            saveTempFormData={saveTempFormData}
            isEmailVerified={isEmailConfirmed}
          />
        ) : (
          <SignupStepComponent />
        )}

        {/* 이전/다음 버튼 */}
        <SignupSectionButton
          currentStep={currentStep}
          handleNext={handleNext}
          isLastStep={isLastStep}
          handlePrev={handlePrev}
          isNextButtonEnabled={isNextButtonEnabled}
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
