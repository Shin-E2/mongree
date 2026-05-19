"use server";

import { createClient } from "@/lib/supabase-server";
import { escapePostgrestLikePattern } from "@/lib/supabase/filters";
import type {
  GetPublicDiariesParams,
  PublicDiary,
  PublicDiaryResponse,
} from "./types";

const ITEMS_PER_PAGE = 12;

interface PublicDiaryFeedRow {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  is_private: boolean | null;
  user_id: string;
  profile: {
    id: string;
    nickname: string;
    profile_image: string | null;
  } | null;
  emotions: PublicDiary["diaryEmotion"];
  images: PublicDiary["images"];
  tags: PublicDiary["tags"];
  like_count: number | null;
  comment_count: number | null;
  total_count: number | null;
}

export async function getPublicDiaries({
  page,
  searchTerm,
  emotions,
  sortBy = "latest",
}: GetPublicDiariesParams): Promise<PublicDiaryResponse> {
  try {
    const supabase = await createClient();
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const keyword = searchTerm?.trim();
    const emotionIds = emotions?.filter(Boolean) ?? [];

    const { data, error } = await supabase.rpc("get_public_diary_feed", {
      p_limit: ITEMS_PER_PAGE,
      p_offset: skip,
      p_search: keyword ? escapePostgrestLikePattern(keyword) : null,
      p_emotion_ids: emotionIds,
      p_sort_by: sortBy,
    });

    if (error) {
      console.error("Supabase public diary feed error:", error);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        total: 0,
        error: error.message,
      };
    }

    const rows = (data ?? []) as PublicDiaryFeedRow[];
    const total = Number(rows[0]?.total_count ?? 0);

    const diaries: PublicDiary[] = rows.map((diary) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ? new Date(diary.created_at) : new Date(),
      updatedAt: diary.updated_at ? new Date(diary.updated_at) : new Date(),
      isPrivate: diary.is_private ?? false,
      userId: diary.user_id,
      user: diary.profile,
      diaryEmotion: diary.emotions ?? [],
      images: diary.images ?? [],
      tags: diary.tags ?? [],
      empathies: [],
      _count: {
        empathies: diary.like_count ?? 0,
        comments: diary.comment_count ?? 0,
      },
    }));

    return {
      success: true,
      diaries,
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
