"use client";

import { useEffect, useState } from "react";
import { checkNickname } from "./action";
import { useFormContext } from "react-hook-form";

export default function useSignupStepBasicInfoNicknameContainer() {
  const {
    register,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const [successMessage, setSuccessMessage] = useState("");

  // 닉네임 값 추적
  const nicknameValue = watch("nickname");

  // 닉네임 값 변경 시 successMessage 초기화
  useEffect(() => {
    if (!nicknameValue) setSuccessMessage("");
  }, [nicknameValue]);

  const handleCheckNickname = async () => {
    try {
      clearErrors("nickname"); // 이전 에러 초기화
      setSuccessMessage(""); // 체크 시작할 때 성공 메시지 초기화

      const nickname = nicknameValue;
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
  };
}
