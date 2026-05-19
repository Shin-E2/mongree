"use server";

import {
  SignupFormSchema,
  SignupFormType,
} from "../step-basic-info/form.schema";
import { createClient } from "@/lib/supabase-server";
import {
  deleteImageFromS3,
  uploadImageServer,
} from "@/commons/utils/upload-images";
import { getSiteUrl } from "@/commons/utils/site-url";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signup(data: SignupFormType) {
  try {
    const result = await SignupFormSchema.safeParseAsync(data);

    if (!result.success) {
      return {
        success: false,
        fieldErrors: result.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();
    const siteUrl = await getSiteUrl();
    const profileImageFile =
      result.data.profileImage instanceof File ? result.data.profileImage : null;
    let profileImageUrl =
      typeof result.data.profileImage === "string" ? result.data.profileImage : null;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          full_name: data.name,
          nickname: result.data.nickname,
          profile_image: profileImageFile ? null : profileImageUrl,
        },
        emailRedirectTo: `${siteUrl}/confirm?source=signup`,
      },
    });

    if (authError) {
      console.error("Supabase Auth 회원가입 오류:", authError);

      if (authError.message.includes("already registered")) {
        return {
          success: false,
          fieldErrors: { email: ["이미 사용 중인 이메일입니다."] },
        };
      }

      return {
        success: false,
        message: `회원가입 중 오류가 발생했습니다: ${authError.message}`,
      };
    }

    if (profileImageFile && authData.user) {
      profileImageUrl = await uploadImageServer(profileImageFile);
      const admin = createAdminClient();
      const { error: profileUpdateError } = await admin
        .from("profiles")
        .update({ profile_image: profileImageUrl })
        .eq("id", authData.user.id);

      if (profileUpdateError) {
        await deleteImageFromS3(profileImageUrl);
        return {
          success: false,
          message: `프로필 이미지 저장 중 오류가 발생했습니다: ${profileUpdateError.message}`,
        };
      }
    }

    return {
      success: true,
      user: authData.user,
      message:
        "회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.",
    };
  } catch (error) {
    console.error("회원가입 처리 중 예기치 못한 오류:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
