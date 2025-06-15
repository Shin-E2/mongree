import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { supabase } from "@/lib/supabase-client";
import { type SignupFormType } from "../form.schema";
import { type EmailVerificationState } from "./types";
import { checkEmail } from "../action";
import type { SignupTempFormData } from "@/commons/constants/signup";

interface UseEmailVerificationProps {
  initialFormData: SignupTempFormData;
}

export const useEmailVerification = ({
  initialFormData,
}: UseEmailVerificationProps) => {
  const {
    setError,
    clearErrors,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<SignupFormType>();

  const [state, setState] = useState<Omit<EmailVerificationState, 'isVerified'>>({
    isVerifying: false,
    successMessage: "",
  });

  const emailValue = watch("email", "");

  // initialFormData로 이메일 필드 초기화
  useEffect(() => {
    if (initialFormData.email) {
      setValue("email", initialFormData.email);
    }
  }, [initialFormData.email, setValue]);

  const handleVerifyEmail = async () => {
    clearErrors("email");
    setState((prev) => ({ ...prev, successMessage: "", isVerifying: true }));

    // 이메일 유효성 먼저 체크
    if (errors.email) {
      setState((prev) => ({ ...prev, isVerifying: false }));
      return;
    }

    try {
      // 이메일 중복 체크 (서버 액션 사용)
      const checkResult = await checkEmail({ email: emailValue });

      if (!checkResult.success) {
        // 중복된 이메일인 경우 에러 처리
        setError("email", {
          type: "manual",
          message: checkResult.message || "이미 사용 중인 이메일입니다.",
        });
        setState((prev) => ({ ...prev, isVerifying: false }));
        return;
      }

      // OTP 이메일 발송
      const { error } = await supabase.auth.signInWithOtp({
        email: emailValue,
        options: {
          shouldCreateUser: true, // 새로운 사용자를 생성하고 OTP를 발송
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError("email", { type: "manual", message: error.message });
        setState((prev) => ({ ...prev, isVerifying: false }));
      } else {
        setState((prev) => ({
          ...prev,
          isVerifying: false,
          successMessage: "인증 메일이 발송되었습니다. 메일함을 확인하세요.",
        }));
      }
    } catch (error) {
      setError("email", {
        type: "manual",
        message: "인증 중 오류가 발생했습니다.",
      });
      setState((prev) => ({ ...prev, isVerifying: false }));
    }
  };

  // 이메일 입력값 변경 시 상태 초기화
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      successMessage: "",
      isVerifying: false,
    }));
    clearErrors("email"); // 이메일 값 변경 시 에러 초기화
  }, [emailValue, clearErrors]);

  return {
    emailValue,
    state,
    handleVerifyEmail,
    register,
    errors,
  };
};
