"use server";

import { createClient } from "@/lib/supabase-server";
import { LoginFormSchema, type LoginFormType } from "./form.schema";
import { login } from "@/lib/login";
import { redirect } from "next/navigation";
import { URL } from "@/commons/constants/global-url";

// 로그인
export const clickLogin = async (data: LoginFormType) => {
  console.log("로그인 데이터", data);

  // 폼 데이터 검증
  const result = await LoginFormSchema.safeParseAsync(data);
  if (!result.success) {
    return {
      fieldErrors: {
        email: result.error.formErrors.fieldErrors.email || [],
        password: result.error.formErrors.fieldErrors.password || [],
      },
    };
  }

  console.log("검증 결과:", result);

  try {
    const supabase = await createClient();

    // Supabase Auth를 사용하여 이메일과 비밀번호로 로그인
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (authError) {
      console.error('로그인 오류:', authError);
      // Supabase Auth 에러 코드를 기반으로 사용자에게 보여줄 메시지 조정
      let errorMessage = "로그인에 실패했습니다.";
      if (authError.message.includes("Invalid login credentials")) {
          errorMessage = "이메일 또는 비밀번호가 잘못되었습니다.";
      }
      return {
        fieldErrors: {
          email: [],
          password: [errorMessage],
        },
      };
    }

    // 로그인 성공 시 세션 설정
    if (authData.user) {
      await login(authData.user.id); // 세션에 Supabase user ID 저장
      console.log(URL().HOME);
       // redirect를 try-catch 밖으로 이동 => 안에 있으니까 에러 발생 시 redirect가 안됨
      redirect(URL().HOME); // 성공 시 리다이렉트
    } else {
        // user 객체가 없는 경우 (예: 이메일 미인증 등 추가 확인 필요)
        return {
            fieldErrors: {
                email: [],
                password: ["로그인 후 사용자 정보를 가져오는데 실패했습니다."],
            },
        };
    }

  } catch (error) {
    console.error('로그인 처리 중 예외 발생:', error);
    return {
      fieldErrors: {
        email: ["로그인 처리 중 오류가 발생했습니다."],
        password: [],
      },
    };
  }
};
