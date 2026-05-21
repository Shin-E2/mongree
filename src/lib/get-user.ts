"use server";

import { createClient } from "./supabase-server";

export async function getCurrentAuthUser() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return null;

  return user;
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();

  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, nickname, profile_image, created_at, updated_at, is_profile_complete")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("프로필 조회 오류:", profileError);
    return null;
  }

  return profile ?? null;
}

export const getUser = getCurrentProfile;
