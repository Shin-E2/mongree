import type { createClient } from "@/lib/supabase-server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function insertDiaryRow(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  content: string,
  isPrivate: boolean
) {
  const { data: diary, error } = await supabase
    .from("diaries")
    .insert({
      user_id: userId,
      title,
      content,
      is_private: isPrivate,
    })
    .select("id")
    .single();

  if (error || !diary) {
    throw new Error(error?.message ?? "일기 생성 응답이 비어 있습니다.");
  }

  return diary.id;
}
