"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/get-user";

function formatComment(comment: any) {
  return {
    ...comment,
    userId: comment.user_id,
    diaryId: comment.diary_id,
    parentId: comment.parent_id,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    user: comment.profiles,
    likes: comment.comment_likes ?? [],
  };
}

export async function toggleCommentLike(commentId: string, diaryId: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "로그인이 필요합니다." };
    const supabase = await createClient();

    const { data: existingLike, error: checkError } = await supabase
      .from("comment_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("comment_id", commentId)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase comment like check error:", checkError);
      throw new Error(checkError.message);
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("comment_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        console.error("Supabase comment like delete error:", deleteError);
        throw new Error(deleteError.message);
      }
    } else {
      const { error: createError } = await supabase
        .from("comment_likes")
        .insert([{ user_id: user.id, comment_id: commentId }]);

      if (createError) {
        console.error("Supabase comment like create error:", createError);
        throw new Error(createError.message);
      }
    }

    revalidateTag(`comment-${commentId}`);
    revalidateTag(`diary-comments-${diaryId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update comment like." };
  }
}

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
    if (parentId) {
      const { data: parentComment, error: parentCheckError } = await supabase
        .from("comments")
        .select("id, parent_id")
        .eq("id", parentId)
        .single();

      if (parentCheckError && parentCheckError.code !== "PGRST116") {
        console.error("Supabase parent comment check error:", parentCheckError);
        throw new Error(parentCheckError.message);
      }

      if (!parentComment) {
        return { error: "Parent comment was not found." };
      }

      if (parentComment.parent_id) {
        return { error: "Replies cannot have nested replies." };
      }
    }

    const { data: comment, error: createCommentError } = await supabase
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

    if (createCommentError) {
      console.error("Supabase comment create error:", createCommentError);
      throw new Error(createCommentError.message);
    }

    revalidateTag(`comments-${diaryId}`);
    if (parentId) {
      revalidateTag(`replies-${parentId}`);
    }

    return { success: true, comment: formatComment(comment) };
  } catch (error) {
    console.error("addComment error:", error);
    return { error: "Failed to create comment." };
  }
}

export async function deleteComment(commentId: string, diaryId: string) {
  const user = await getUser();
  if (!user) return { error: "로그인이 필요합니다." };
  const supabase = await createClient();

  try {
    const { data: commentToDelete, error: checkDeleteError } = await supabase
      .from("comments")
      .select("user_id, parent_id")
      .eq("id", commentId)
      .single();

    if (checkDeleteError && checkDeleteError.code !== "PGRST116") {
      console.error("Supabase comment check error:", checkDeleteError);
      throw new Error(checkDeleteError.message);
    }

    if (!commentToDelete || commentToDelete.user_id !== user.id) {
      return { error: "You do not have permission to delete this comment." };
    }

    const { error: deleteCommentError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (deleteCommentError) {
      console.error("Supabase comment delete error:", deleteCommentError);
      throw new Error(deleteCommentError.message);
    }

    revalidateTag(`comments-${diaryId}`);
    if (commentToDelete.parent_id) {
      revalidateTag(`replies-${commentToDelete.parent_id}`);
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete comment." };
  }
}
