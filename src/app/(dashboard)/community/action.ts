"use server";

import { createClient } from "@/lib/supabase-server";
import type { GetPublicDiariesParams, PublicDiaryResponse } from "./types";

const ITEMS_PER_PAGE = 12;

export async function getPublicDiaries({
  page,
  searchTerm,
  emotions,
  sortBy = "latest",
}: GetPublicDiariesParams): Promise<PublicDiaryResponse> {
  try {
    const supabase = await createClient();
    const skip = (page - 1) * ITEMS_PER_PAGE;

    let query = supabase
      .from("diaries")
      .select(
        `
        id,
        title,
        content,
        created_at,
        updated_at,
        is_private,
        user_id,
        profiles (
          id,
          user_id,
          username,
          nickname,
          profile_image
        ),
        diary_emotions (
          diary_id,
          emotion_id,
          emotions (
            id,
            label,
            image
          )
        ),
        diary_images (
          id,
          diary_id,
          image_url,
          sort_order
        ),
        diary_tags (
          diary_id,
          tag_id,
          tags (
            id,
            name
          )
        ),
        diary_likes (
          id,
          created_at,
          profiles (
            id,
            user_id,
            profile_image
          )
        ),
        comments (
          id
        )
        `,
        { count: "exact" }
      )
      .eq("is_private", false);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (emotions?.length) {
      query = query.in("diary_emotions.emotion_id", emotions);
    }

    if (sortBy === "popular") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error, count } = await query.range(skip, skip + ITEMS_PER_PAGE - 1);

    if (error) {
      console.error("Supabase public diary list error:", error);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        total: 0,
        error: error.message,
      };
    }

    const formattedDiaries = (data ?? []).map((diary: any) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ? new Date(diary.created_at) : new Date(),
      updatedAt: diary.updated_at ? new Date(diary.updated_at) : new Date(),
      isPrivate: diary.is_private ?? false,
      userId: diary.user_id,
      user: diary.profiles,
      diaryEmotion:
        diary.diary_emotions
          ?.map((item: any) => ({
            emotion: item.emotions,
            diaryId: item.diary_id,
            emotionId: item.emotion_id,
          }))
          .filter((item: any) => item.emotion) ?? [],
      images:
        diary.diary_images
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((image: any) => ({
            id: image.id,
            image_url: image.image_url,
            sort_order: image.sort_order,
            diary_id: image.diary_id,
          })) ?? [],
      tags:
        diary.diary_tags
          ?.map((item: any) => ({
            tag: item.tags,
            diaryId: item.diary_id,
            tagId: item.tag_id,
          }))
          .filter((item: any) => item.tag) ?? [],
      empathies:
        diary.diary_likes?.map((like: any) => ({
          id: like.id,
          createdAt: like.created_at ? new Date(like.created_at) : new Date(),
          user: like.profiles,
        })) ?? [],
      _count: {
        empathies: diary.diary_likes?.length ?? 0,
        comments: diary.comments?.length ?? 0,
      },
    }));

    const total = count ?? 0;

    return {
      success: true,
      diaries: formattedDiaries,
      hasMore: skip + ITEMS_PER_PAGE < total,
      total,
    };
  } catch (error) {
    console.error("getPublicDiaries error:", error);
    return {
      success: false,
      diaries: [],
      hasMore: false,
      total: 0,
      error: "Failed to load public diaries.",
    };
  }
}
