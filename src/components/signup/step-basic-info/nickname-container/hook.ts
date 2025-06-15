"use client";

import { useEffect, useState } from "react";
import { checkNickname } from "./action";
import { useFormContext } from "react-hook-form";
import { SignupFormType } from "../form.schema";
import { SignupTempFormData } from "@/app/(auth)/signup/hook";

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

  // 닉네임 값 추적
  const nicknameValue = watch("nickname", "");

  // initialFormData로 닉네임 필드 초기화
  useEffect(() => {
    if (initialFormData.nickname) {
      setValue("nickname", initialFormData.nickname);
    }
  }, [initialFormData.nickname, setValue]);

  // 닉네임 값 변경 시 successMessage 초기화
  useEffect(() => {
    console.log("닉네임 값:", nicknameValue);
    if (!nicknameValue) setSuccessMessage("");
  }, [nicknameValue]);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue("nickname", value, { shouldValidate: true });
  };

  const handleCheckNickname = async () => {
    try {
      clearErrors("nickname"); // 이전 에러 초기화
      // setSuccessMessage(""); // 체크 시작할 때 성공 메시지 초기화

      saveTempFormData(getValues()); // 중복 확인 전에 현재 폼 데이터 저장

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
    } catch (error) {
      setError("nickname", {
        type: "manual",
        message: "이 닉네임은 이미 사용중입니다.",
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
