import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGXP,
  PASSWORD_REGXP_ERROR,
} from "@/components/signup/step-basic-info/constants";

export const LoginFormSchema = z.object({
  email: z.string().email().toLowerCase().min(1, "이메일을 입력해주세요"),
  // .refine(checkEmailExists, "이메일이 존재하지 않습니다"),

  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, "비밀번호를 입력해주세요")
    .regex(PASSWORD_REGXP, PASSWORD_REGXP_ERROR),
});

// 로그인 타입
export type LoginFormType = z.infer<typeof LoginFormSchema>;
