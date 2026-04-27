"use server";

import { createClient } from "./supabase-server";

// iron-session 제거 → Supabase 네이티브 세션으로 유저 정보 조회
// @supabase/ssr이 쿠키 기반 세션을 자동 처리하므로 별도 세션 저장 불필요
export async function getUser() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("프로필 조회 오류:", profileError);
    return null;
  }

  return profile ?? null;
}
