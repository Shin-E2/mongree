"use server";

import db from "@/lib/db";
import { LoginFormSchema, type LoginFormType } from "./form.schema";
import bcrypt from "bcrypt";
import { Login } from "@/lib/login";
import { redirect } from "next/navigation";
import { URL } from "@/commons/constants/global-url";

// 이메일 일치 확인
const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

// 로그인
export const login = async (data: LoginFormType) => {
  console.log("로그인 데이터", data);

  // 이메일로 사용자 찾기
  const emailExists = await checkEmailExists(data.email);
  if (!emailExists) {
    console.log("해당 이메일 없습니다.");
    return {
      fieldErrors: {
        email: ["이메일이 존재하지 않습니다"],
        password: [],
      },
    };
  } else {
    const result = await LoginFormSchema.safeParseAsync(data);
    console.log("이게뭐람?", result);

    // 이메일로 사용자를 찾았다면 비밀번호의 해시값 확인하기
    const user = await db.user.findUnique({
      where: { email: result.data?.email },
      select: { id: true, password: true },
    });

    const ok = await bcrypt.compare(
      result.data?.password!,
      user!.password ?? ""
    );

    if (ok) {
      await Login(user!.id); // 쿠키 저장
      // 로그인 성공 후 데시보드 페이지로 리다이렉트
      redirect(URL().HOME);
    } else {
      return {
        fieldErrors: {
          email: [],
          password: ["틀린 비밀번호 입니다"],
        },
      };
    }
  }
};
