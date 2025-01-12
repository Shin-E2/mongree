import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGXP,
  PASSWORD_REGXP_ERROR,
} from "./constants";
import { checkEmail, checkPasswords } from "./action";

// 주소 검증 스키마
export const AddressFormSchema = z.object({
  zoneCode: z.string().optional(),
  address: z.string().optional(),
  detailAddress: z.string().optional(),
});

// 회원가입 검증 스키마
export const SignupFormSchema = z
  .object({
    name: z.string().trim().min(2, "이름을 작성해주세요."),
    nickname: z.string().trim().min(2, "닉네임은 2글자 이상 작성해주세요."),
    email: z
      .string()
      .trim()
      .email("이메일을 올바르게 입력해주세요.")
      .toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 10자 이상 작성해주세요.")
      .regex(PASSWORD_REGXP, PASSWORD_REGXP_ERROR),
    passwordConfirm: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 10자 이상 작성해주세요."),
    address: AddressFormSchema,
    profileImage: z.string().optional(),
    // .any()
    // .optional()
    // .refine((file) => {
    //   if (!file) return true; // 파일이 없는 경우 통과
    //   return file instanceof File;
    // }, "올바른 파일 형식이 아닙니다")
    // .refine((file) => {
    //   if (!file) return true;
    //   return file.type.startsWith("image/");
    // }, "이미지 파일만 업로드 가능합니다")
    // .refine((file) => {
    //   if (!file) return true;
    //   return file.size <= 5 * 1024 * 1024; // 5MB
    // }, "파일 크기는 5MB 이하여야 합니다"),
  })
  // password === passwordConfirm인지 확인하기
  .refine(checkPasswords, {
    message: "비밀번호를 똑같이 입력해주세요.",
    path: ["passwordConfirm"],
  })

  // 닉네임 중복 검사하기
  // .superRefine(checkNickname)
  // 이메일 중복 검사하기
  .superRefine(checkEmail);

// 회원가입 form zod 타입 => react-hook-form에서 form데이터 타입 정의할때 사용
export type SignupFormType = z.infer<typeof SignupFormSchema>;
