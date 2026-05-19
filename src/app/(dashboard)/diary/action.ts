"use server";

import { getCurrentProfile } from "@/lib/get-user";
import { buildDiarySearchOrFilter } from "@/lib/supabase/filters";
import { createClient } from "@/lib/supabase-server";
import type { Diary, DiaryResponse, GetDiariesParams } from "./types";

const ITEMS_PER_PAGE = 12;

type DiaryListRow = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  is_private: boolean | null;
  diary_emotions?: {
    diary_id: string;
    emotion_id: string;
    emotions?: { id: string | null; label: string | null } | null;
  }[] | null;
  diary_images?: {
    id: string;
    image_url: string;
    sort_order: number;
    diary_id: string;
  }[] | null;
  diary_tags?: {
    diary_id: string;
    tag_id: string;
    tags?: { id: string | null; name: string | null } | null;
  }[] | null;
};

export async function getDiaries({
  page,
  searchTerm,
  emotions,
  dateRange,
}: GetDiariesParams): Promise<DiaryResponse> {
  try {
    const user = await getCurrentProfile();

    if (!user) {
      return {
        success: true,
        diaries: [],
        hasMore: false,
      };
    }

    const supabase = await createClient();
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const emotionIds = emotions?.filter(Boolean) ?? [];

    // 선택한 감정 중 하나라도 연결된 일기만 조회합니다.
    let filteredDiaryIds: string[] | null = null;
    if (emotionIds.length > 0) {
      const { data: emotionRows, error: emotionError } = await supabase
        .from("diary_emotions")
        .select("diary_id, diaries!inner(user_id)")
        .in("emotion_id", emotionIds)
        .eq("diaries.user_id", user.id);

      if (emotionError) {
        console.error("Supabase diary emotion filter error:", emotionError);
        return {
          success: false,
          diaries: [],
          hasMore: false,
          error: emotionError.message,
        };
      }

      filteredDiaryIds = Array.from(
        new Set((emotionRows ?? []).map((row) => row.diary_id))
      );

      if (filteredDiaryIds.length === 0) {
        return {
          success: true,
          diaries: [],
          hasMore: false,
        };
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
        diary_emotions (
          diary_id,
          emotion_id,
          emotions (
            id,
            label
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
        )
        `,
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .is("deleted_at", null);

    if (searchTerm) {
      query = query.or(buildDiarySearchOrFilter(searchTerm));
    }

    if (filteredDiaryIds) {
      query = query.in("id", filteredDiaryIds);
    }

    if (dateRange?.start && dateRange?.end) {
      query = query
        .gte("created_at", dateRange.start.toISOString())
        .lte("created_at", dateRange.end.toISOString());
    }

    const { data: diaries, error, count } = await query
      .order("created_at", { ascending: false })
      .range(skip, skip + ITEMS_PER_PAGE - 1);

    if (error) {
      console.error("Supabase diary list error:", error);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        error: error.message,
      };
    }

    const formattedDiaries: Diary[] = ((diaries ?? []) as DiaryListRow[]).map((diary) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      userId: diary.user_id,
      createdAt: diary.created_at ? new Date(diary.created_at) : new Date(),
      updatedAt: diary.updated_at ? new Date(diary.updated_at) : new Date(),
      isPrivate: diary.is_private ?? false,
      diaryEmotion:
        diary.diary_emotions
          ?.map((item) => ({
            emotion: {
              id: item.emotions?.id ?? "",
              label: item.emotions?.label ?? "",
            },
            diaryId: item.diary_id,
            emotionId: item.emotion_id,
          }))
          .filter((item) => item.emotion.id) ?? [],
      images:
        diary.diary_images
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => ({
            id: image.id,
            url: image.image_url,
            order: image.sort_order,
            diaryId: image.diary_id,
          })) ?? [],
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
    }));

    const totalCount = count ?? 0;

    return {
      success: true,
      diaries: formattedDiaries,
      hasMore: skip + ITEMS_PER_PAGE < totalCount,
    };
  } catch (error) {
    console.error("getDiaries error:", error);
    return {
      success: false,
      diaries: [],
      hasMore: false,
      error: "Failed to load diaries.",
    };
  }
}
