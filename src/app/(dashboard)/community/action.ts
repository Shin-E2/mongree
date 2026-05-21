"use server";

import { createClient } from "@/lib/supabase-server";
import {
  buildDiarySearchOrFilter,
  escapePostgrestLikePattern,
} from "@/lib/supabase/filters";
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

type PublicDiaryFallbackRow = {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  is_private: boolean | null;
  user_id: string;
  profiles: PublicDiaryFeedRow["profile"];
  diary_emotions?: {
    diary_id: string;
    emotion_id: string;
    emotions?: { id: string | null; label: string | null; image: string | null } | null;
  }[] | null;
  diary_images?: PublicDiary["images"];
  diary_tags?: {
    diary_id: string;
    tag_id: string;
    tags?: { id: string | null; name: string | null } | null;
  }[] | null;
  diary_likes?: { id: string }[] | null;
  comments?: { id: string; deleted_at: string | null }[] | null;
};

function isMissingPublicDiaryFeedRpc(error: { message?: string; details?: string | null }) {
  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  return (
    text.includes("Could not find the function") ||
    text.includes("get_public_diary_feed")
  );
}

function formatFallbackDiary(diary: PublicDiaryFallbackRow): PublicDiary {
  const comments = diary.comments?.filter((comment) => !comment.deleted_at) ?? [];

  return {
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
        ?.map((item) => ({
          emotion: {
            id: item.emotions?.id ?? "",
            label: item.emotions?.label ?? "",
            image: item.emotions?.image ?? null,
          },
          diaryId: item.diary_id,
          emotionId: item.emotion_id,
        }))
        .filter((item) => item.emotion.id) ?? [],
    images:
      diary.diary_images
        ?.slice()
        .sort((a, b) => a.sort_order - b.sort_order) ?? [],
    tags:
      diary.diary_tags
        ?.map((item) => ({
          tag: {
            id: item.tags?.id ?? "",
            name: item.tags?.name ?? "",
          },
          diaryId: item.diary_id,
          tagId: item.tag_id,
        }))
        .filter((item) => item.tag.id) ?? [],
    empathies: [],
    _count: {
      empathies: diary.diary_likes?.length ?? 0,
      comments: comments.length,
    },
  };
}

async function getPublicDiariesFallback({
  supabase,
  skip,
  searchTerm,
  emotionIds,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  skip: number;
  searchTerm?: string;
  emotionIds: string[];
}): Promise<PublicDiaryResponse> {
  let filteredDiaryIds: string[] | null = null;

  if (emotionIds.length > 0) {
    const { data: emotionRows, error: emotionError } = await supabase
      .from("diary_emotions")
      .select("diary_id, diaries!inner(is_private, deleted_at)")
      .in("emotion_id", emotionIds)
      .eq("diaries.is_private", false)
      .is("diaries.deleted_at", null);

    if (emotionError) {
      console.error("Supabase public diary fallback emotion error:", emotionError);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        total: 0,
        error: "공개 일기를 불러오지 못했습니다.",
      };
    }

    filteredDiaryIds = Array.from(
      new Set((emotionRows ?? []).map((row) => row.diary_id))
    );

    if (filteredDiaryIds.length === 0) {
      return { success: true, diaries: [], hasMore: false, total: 0 };
    }
  }

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
        image_url,
        sort_order,
        diary_id
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
        id
      ),
      comments (
        id,
        deleted_at
      )
      `,
      { count: "exact" }
    )
    .eq("is_private", false)
    .is("deleted_at", null);

  if (searchTerm) {
    query = query.or(buildDiarySearchOrFilter(searchTerm));
  }

  if (filteredDiaryIds) {
    query = query.in("id", filteredDiaryIds);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(skip, skip + ITEMS_PER_PAGE - 1);

  if (error) {
    console.error("Supabase public diary fallback error:", error);
    return {
      success: false,
      diaries: [],
      hasMore: false,
      total: 0,
      error: "공개 일기를 불러오지 못했습니다.",
    };
  }

  const rows = ((data ?? []) as PublicDiaryFallbackRow[]).map(formatFallbackDiary);
  const total = count ?? rows.length;

  return {
    success: true,
    diaries: rows,
    hasMore: skip + ITEMS_PER_PAGE < total,
    total,
  };
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
      p_search: keyword ? escapePostgrestLikePattern(keyword) : undefined,
      p_emotion_ids: emotionIds,
      p_sort_by: sortBy,
    });

    if (error) {
      if (isMissingPublicDiaryFeedRpc(error)) {
        return getPublicDiariesFallback({
          supabase,
          skip,
          searchTerm: keyword,
          emotionIds,
        });
      }

      console.error("Supabase public diary feed error:", error);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        total: 0,
        error: "공개 일기를 불러오지 못했습니다.",
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
      error: "공개 일기를 불러오지 못했습니다.",
    };
  }
}
