"use server";

import { notFound } from "next/navigation";
import { getSession } from "./session";
import { createClient } from "./supabase-server";

export async function getUser() {
  const session = await getSession();

  if (!session?.id) {
    notFound();
  }

  const supabase = await createClient();

  const { data: userProfile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase 프로필 조회 오류:', error);
    throw new Error("사용자 프로필을 불러오는데 실패했습니다.");
  }

  if (!userProfile) {
    console.warn(`사용자 ${session.id} 에 대한 프로필 데이터가 없습니다.`);
    return null;
  }

  return userProfile;
}
