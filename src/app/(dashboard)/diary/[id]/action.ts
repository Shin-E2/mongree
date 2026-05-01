"use server";

import { createClient } from "@/lib/supabase-server";
import type { Tables } from "@/lib/supabase.types";

interface RawComment {
  id: string;
  content: string;
  parent_id: string | null;
  user_id: string;
  diary_id: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  profiles: { id: string; nickname: string; profile_image: string | null } | null;
  comment_likes: Tables<"comment_likes">[];
  replies?: RawComment[];
}

interface FormattedComment extends Omit<RawComment, "replies"> {
  parentId: string | null;
  userId: string;
  diaryId: string;
  createdAt: string | null;
  updatedAt: string | null;
  user: RawComment["profiles"];
  likes: Tables<"comment_likes">[];
  replies: FormattedComment[];
}

function formatComment(comment: RawComment): FormattedComment {
  return {
    ...comment,
    parentId: comment.parent_id,
    userId: comment.user_id,
    diaryId: comment.diary_id,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    user: comment.profiles,
    likes: comment.comment_likes ?? [],
    replies: comment.replies?.map((reply) => formatComment(reply)) ?? [],
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
            nickname,
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
            nickname,
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

    const rawComments = (diary.comments ?? []) as RawComment[];
    const activeComments = rawComments.filter((c) => c.deleted_at === null);
    const topLevelComments = activeComments
      .filter((c) => c.parent_id === null)
      .map((c) => ({
        ...c,
        replies: activeComments.filter((r) => r.parent_id === c.id),
      }))
      .map((c) => formatComment(c));

    return {
      ...diary,
      user: diary.profiles,
      images:
        diary.diary_images
          ?.slice()
          .sort((a, b) => a.sort_order - b.sort_order) ?? [],
      diaryEmotion:
        diary.diary_emotions
          ?.map((item) => ({
            emotion: item.emotions,
            diaryId: item.diary_id,
            emotionId: item.emotion_id,
          }))
          .filter((item) => item.emotion) ?? [],
      empathies: diary.diary_likes ?? [],
      tags:
        diary.diary_tags
          ?.map((item) => ({
            tag: item.tags,
            diaryId: item.diary_id,
            tagId: item.tag_id,
          }))
          .filter((item) => item.tag) ?? [],
      comments: topLevelComments,
    };
  } catch (error) {
    console.error("getDiaryDetail error:", error);
    throw error;
  }
}
