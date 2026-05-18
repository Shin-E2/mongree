import { useEffect, useState } from "react";
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

  const [state, setState] = useState<Omit<EmailVerificationState, "isVerified">>({
    isVerifying: false,
    successMessage: "",
  });

  const emailValue = watch("email", "");

  useEffect(() => {
    if (initialFormData.email) {
      setValue("email", initialFormData.email);
    }
  }, [initialFormData.email, setValue]);

  const handleVerifyEmail = async () => {
    clearErrors("email");
    setState((prev) => ({ ...prev, successMessage: "", isVerifying: true }));

    if (errors.email) {
      setState((prev) => ({ ...prev, isVerifying: false }));
      return;
    }

    try {
      const checkResult = await checkEmail({ email: emailValue });

      if (!checkResult.success) {
        setError("email", {
          type: "manual",
          message: checkResult.message || "이미 사용 중인 이메일입니다.",
        });
        setState((prev) => ({ ...prev, isVerifying: false }));
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: emailValue,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/confirm?source=email`,
        },
      });

      if (error) {
        setError("email", { type: "manual", message: error.message });
        setState((prev) => ({ ...prev, isVerifying: false }));
      } else {
        setState((prev) => ({
          ...prev,
          isVerifying: false,
          successMessage: "인증 메일을 발송했습니다. 메일함을 확인해주세요.",
        }));
      }
    } catch {
      setError("email", {
        type: "manual",
        message: "인증 중 오류가 발생했습니다.",
      });
      setState((prev) => ({ ...prev, isVerifying: false }));
    }
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      successMessage: "",
      isVerifying: false,
    }));
    clearErrors("email");
  }, [emailValue, clearErrors]);

  return {
    emailValue,
    state,
    handleVerifyEmail,
    register,
    errors,
  };
};
