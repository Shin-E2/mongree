"use server";

import { createClient } from "./supabase-server";

export async function getCurrentAuthUser() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return null;

  return user;
}

export interface UserProfile {
  id: string;
  nickname: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  is_profile_complete: boolean;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const user = await getCurrentAuthUser();

  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, nickname, profile_image, created_at, updated_at, is_profile_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[get-user] 프로필 조회 오류:", profileError.code, profileError.message);
    return null;
  }

  return profile as UserProfile | null;
}

export const getUser = getCurrentProfile;
