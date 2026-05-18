"use server";

import { createClient } from "@/lib/supabase-server";
import { LoginFormSchema, type LoginFormType } from "./form.schema";
import { redirect } from "next/navigation";
import { URL } from "@/commons/constants/global-url";
import { getSiteUrl } from "@/commons/utils/site-url";

export const clickLogin = async (data: LoginFormType) => {
  const result = await LoginFormSchema.safeParseAsync(data);
  if (!result.success) {
    return {
      fieldErrors: {
        email: result.error.formErrors.fieldErrors.email || [],
        password: result.error.formErrors.fieldErrors.password || [],
      },
    };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (authError) {
    const message = authError.message.includes("Invalid login credentials")
      ? "이메일 또는 비밀번호가 올바르지 않습니다."
      : "로그인에 실패했습니다.";
    return {
      fieldErrors: { email: [], password: [message] },
    };
  }

  if (!authData.user) {
    return {
      fieldErrors: { email: [], password: ["로그인 처리 중 오류가 발생했습니다."] },
    };
  }

  // @supabase/ssr이 세션 쿠키를 자동 저장하므로 별도 login() 호출 불필요
  redirect(URL().HOME);
};

export const requestPasswordReset = async (email: string) => {
  const parsedEmail = LoginFormSchema.shape.email.safeParse(email);

  if (!parsedEmail.success) {
    return {
      fieldErrors: {
        email: parsedEmail.error.issues.map((issue) => issue.message),
        password: [],
      },
    };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
    redirectTo: `${siteUrl}${URL().RESET_PASSWORD}`,
  });

  if (error) {
    return {
      fieldErrors: {
        email: ["비밀번호 재설정 메일을 보내지 못했습니다."],
        password: [],
      },
    };
  }

  return {
    successMessage: "비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요.",
  };
};
