"use server";

import type { IcheckPasswordsProps } from "./types";
import { createAdminClient } from "@/lib/supabase/admin";

// 비밀번호 확인 함수
export const checkPasswords = async ({
  password,
  passwordConfirm,
}: IcheckPasswordsProps) => password === passwordConfirm;

// 이메일 중복 검사
export const checkEmail = async ({
  email }: { email: string }) => {
  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });

  if (error) {
    console.error("Supabase 이메일 중복 확인 에러:", error);
    return { success: false, message: "이메일 확인 중 오류가 발생했습니다." };
  }

  const user = data?.users.find(user => user.email === email);

  if (user) {
    return { success: false, message: "이미 사용 중인 이메일입니다." };
  } else {
    console.log("이메일 사용 가능");
    return { success: true };
  }
};
