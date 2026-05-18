"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SignupTempFormData } from "@/commons/constants/signup";
import { SignupFormType } from "../form.schema";
import { checkNickname } from "./action";

interface UseSignupStepBasicInfoNicknameContainerProps {
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: Partial<SignupFormType>) => void;
}

export default function useSignupStepBasicInfoNicknameContainer({
  initialFormData,
  saveTempFormData,
}: UseSignupStepBasicInfoNicknameContainerProps) {
  const {
    register,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useFormContext<SignupFormType>();
  const [successMessage, setSuccessMessage] = useState("");

  const nicknameValue = watch("nickname", "");

  useEffect(() => {
    if (initialFormData.nickname) {
      setValue("nickname", initialFormData.nickname);
    }
  }, [initialFormData.nickname, setValue]);

  useEffect(() => {
    if (!nicknameValue) setSuccessMessage("");
  }, [nicknameValue]);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("nickname", value, { shouldValidate: true });
  };

  const handleCheckNickname = async () => {
    try {
      clearErrors("nickname");
      saveTempFormData(getValues());
      const nickname = nicknameValue.trim();
      const result = await checkNickname(nickname);

      if (result.success) {
        setSuccessMessage("사용 가능한 닉네임입니다.");
      } else if (result.fieldErrors?.nickname) {
        setError("nickname", {
          type: "manual",
          message: result.fieldErrors.nickname[0],
        });
      }
    } catch {
      setError("nickname", {
        type: "manual",
        message: "닉네임을 확인할 수 없습니다.",
      });
    }
  };

  return {
    register,
    errors,
    successMessage,
    handleCheckNickname,
    nicknameValue,
    isSubmitting,
    handleNicknameChange,
  };
}
