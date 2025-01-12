"use server";

import db from "@/lib/db";
import type { IcheckPasswordsProps } from "./types";
import { z } from "zod";

// 비밀번호 확인 함수
export const checkPasswords = async ({
  password,
  passwordConfirm,
}: IcheckPasswordsProps) => password === passwordConfirm;

// 이메일 중복 검사
export const checkEmail = async (
  { email }: { email: string },
  ctx: z.RefinementCtx
) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "이 이메일은 이미 사용중 입니다.",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  } else {
    console.log("이메일 사용 가능");
  }
};
