"use server";

import type { SignupFormType } from "../step-basic-info/form.schema";

/* 
// useActionState를 사용할 경우
export async function signup(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    zoneCode: formData.get("zoneCode"),
    address: formData.get("address"),
    detailAddress: formData.get("detailAddress"),
  };

  console.log(data);
} */

export async function signup(data: SignupFormType) {
  console.log("회원가입 정보", data);
}
