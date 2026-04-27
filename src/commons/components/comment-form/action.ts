"use server";

import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";

export async function addComment(formData: FormData) {
  const user = await getUser();
  const content = formData.get("content") as string;
  const diaryId = formData.get("diaryId") as string;
  const parentId = formData.get("parentId") as string | null;

  const supabase = await createClient();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  if (!content?.trim()) {
    return { error: "Content is required." };
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
          user_id,
          username,
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

    revalidateTag(`comments-${diaryId}`);
    if (parentId) {
      revalidateTag(`replies-${parentId}`);
    }

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
  } catch (error) {
    return { error: "Failed to create comment." };
  }
}
