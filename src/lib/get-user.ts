"use server";

import { createClient } from "./supabase-server";

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
