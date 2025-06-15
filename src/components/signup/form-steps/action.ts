"use server";

import { FILE_CONSTRAINTS } from "@/commons/constants/validation";
import {
  SignupFormSchema,
  SignupFormType,
} from "../step-basic-info/form.schema";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/commons/utils/upload-images";

export async function signup(data: SignupFormType) {
  try {
    // 1. 이미지 업로드
    let profileImageUrl: string | null = null;
    if (data.profileImage && data.profileImage instanceof File) {
      profileImageUrl = await uploadImage(data.profileImage);
    } else if (typeof data.profileImage === "string") {
      profileImageUrl = data.profileImage;
    }

    // 2. 데이터 검증
    const result = await SignupFormSchema.safeParseAsync({
      ...data,
      profileImage: profileImageUrl,
    });

    if (!result.success) {
      return {
        success: false,
        fieldErrors: result.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    // 3. 회원가입 (메타데이터 올바르게 전달)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          full_name: data.name,
          nickname: result.data.nickname,
          profile_image: profileImageUrl,
          zoneCode: data.address.zoneCode,
          address: data.address.address,
          detailAddress: data.address.detailAddress,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm?source=signup`,
      },
    });

    if (authError) {
      console.error("Supabase Auth 회원가입 에러:", authError);

      if (authError.message.includes("already registered")) {
        return {
          success: false,
          fieldErrors: { email: ["이미 사용 중인 이메일입니다."] },
        };
      }

      return {
        success: false,
        message: `회원가입 중 에러가 발생했습니다: ${authError.message}`,
      };
    }

    console.log("회원가입 성공:", authData);

    return {
      success: true,
      user: authData.user,
      message:
        "회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.",
    };
  } catch (error) {
    console.error("회원가입 처리 중 예기치 않은 에러:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
