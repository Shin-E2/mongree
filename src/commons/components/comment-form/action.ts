"use server";

import { createClient } from "@/lib/supabase-server";
import { getCurrentProfile } from "@/lib/get-user";
import { revalidateDiaryComments } from "@/commons/utils/cache-revalidation";

export async function addComment(formData: FormData) {
  const user = await getCurrentProfile();
  const content = formData.get("content") as string;
  const diaryId = formData.get("diaryId") as string;
  const parentId = formData.get("parentId") as string | null;

  const supabase = await createClient();

  if (!user) {
    return { error: "濡쒓렇?몄씠 ?꾩슂?⑸땲??" };
  }

  if (!content?.trim()) {
    return { error: "?볤? ?댁슜???낅젰?댁＜?몄슂." };
  }

  try {
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        content,
        user_id: user.id,
        diary_id: diaryId,
        parent_id: parentId || null,
      })
      .select(
        `
        *,
        profiles (
          id,
          nickname,
          profile_image
        ),
        comment_likes (
          id,
          user_id
        )
        `
      )
      .single();

    if (error) {
      console.error("Supabase comment create error:", error);
      throw new Error(error.message);
    }

    revalidateDiaryComments(diaryId, parentId);

    return {
      success: true,
      comment: {
        ...comment,
        userId: comment.user_id,
        diaryId: comment.diary_id,
        parentId: comment.parent_id,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        user: comment.profiles,
        likes: comment.comment_likes ?? [],
      },
    };
  } catch {
    return { error: "?볤? ?묒꽦???ㅽ뙣?덉뒿?덈떎." };
  }
}
