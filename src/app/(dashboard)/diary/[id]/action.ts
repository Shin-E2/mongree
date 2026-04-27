"use server";

import { createClient } from "@/lib/supabase-server";

function formatComment(comment: any): any {
  return {
    ...comment,
    parentId: comment.parent_id,
    userId: comment.user_id,
    diaryId: comment.diary_id,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    user: comment.profiles,
    likes: comment.comment_likes ?? [],
    replies: comment.replies?.map((reply: any) => formatComment(reply)) ?? [],
  };
}

export async function getDiaryDetail(diaryId: string) {
  try {
    const supabase = await createClient();

    const { data: diary, error } = await supabase
      .from("diaries")
      .select(
        `
        *,
        profiles (
          id,
          user_id,
          username,
          nickname,
          profile_image
        ),
        diary_images (
          *
        ),
        diary_emotions (
          diary_id,
          emotion_id,
          emotions (
            *
          )
        ),
        diary_likes (
          *,
          profiles (
            id,
            user_id,
            profile_image
          )
        ),
        diary_tags (
          diary_id,
          tag_id,
          tags (
            *
          )
        ),
        comments (
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
        )
        `
      )
      .eq("id", diaryId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase diary detail error:", error);
      throw new Error(error.message);
    }

    if (!diary) {
      throw new Error("Diary not found.");
    }

    const comments = diary.comments ?? [];
    const topLevelComments = comments
      .filter((comment: any) => comment.parent_id === null)
      .map((comment: any) => ({
        ...comment,
        replies: comments.filter((reply: any) => reply.parent_id === comment.id),
      }))
      .map((comment: any) => formatComment(comment));

    return {
      ...diary,
      user: diary.profiles,
      images:
        diary.diary_images?.sort(
          (a: any, b: any) => a.sort_order - b.sort_order
        ) ?? [],
      diaryEmotion:
        diary.diary_emotions
          ?.map((item: any) => ({
            emotion: item.emotions,
            diaryId: item.diary_id,
            emotionId: item.emotion_id,
          }))
          .filter((item: any) => item.emotion) ?? [],
      empathies: diary.diary_likes ?? [],
      tags:
        diary.diary_tags
          ?.map((item: any) => ({
            tag: item.tags,
            diaryId: item.diary_id,
            tagId: item.tag_id,
          }))
          .filter((item: any) => item.tag) ?? [],
      comments: topLevelComments,
    };
  } catch (error) {
    console.error("getDiaryDetail error:", error);
    throw error;
  }
}
