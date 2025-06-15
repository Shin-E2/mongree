"use server";
import { createClient } from "@/lib/supabase-server";

// 닉네임 중복 검사
export const checkNickname = async (nickname: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (data) {
    return {
      fieldErrors: {
        nickname: ["이 닉네임은 이미 사용중 입니다."],
      },
    };
  } else {
    return { success: true };
  }
};
