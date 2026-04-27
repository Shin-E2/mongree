import { URL } from "@/commons/constants/global-url";
import type { SignupFormType } from "../step-basic-info/form.schema";
import { signup } from "./action";
import type { IuseSignupFormStepsProps } from "./types";
import { useMoveToPage } from "@/commons/hooks/use-move-to-page.hook";
import useModal from "@/commons/hooks/use-modal.hook";
import { uploadImage } from "@/commons/utils/upload-images";
import { useState } from "react";

export default function useSignupFormSteps({
  setCurrentStep,
  currentStepData,
}: IuseSignupFormStepsProps) {
  const { moveToPage } = useMoveToPage();
  const { isOpen, setIsOpen } = useModal();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleOk = () => {
    moveToPage(URL().LOGIN)();
  };

  const SignupStepComponent = currentStepData.Component;

  const onSubmit = async (data: SignupFormType) => {
    setSubmitError(null);

    try {
      let updatedData = { ...data };

      if (data.profileImage instanceof File) {
        const imageUrl = await uploadImage(data.profileImage);
        if (!imageUrl) throw new Error("이미지 업로드에 실패했습니다.");
        updatedData = { ...updatedData, profileImage: imageUrl };
      }

      const result = await signup(updatedData);

      if (!result.success) {
        const errorMsg =
          result.fieldErrors?.email?.[0] ||
          result.fieldErrors?.password?.[0] ||
          result.message ||
          "회원가입에 실패했습니다. 다시 시도해주세요.";
        setSubmitError(errorMsg);
        return;
      }

      setIsOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";
      setSubmitError(message);
    }
  };

  return {
    handleNext,
    handlePrev,
    SignupStepComponent,
    onSubmit,
    handleOk,
    isOpen,
    submitError,
  };
}
