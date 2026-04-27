"use server";

import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import type { Diary, DiaryResponse, GetDiariesParams } from "./types";

const ITEMS_PER_PAGE = 12;

export async function getDiaries({
  page,
  searchTerm,
  emotions,
  dateRange,
}: GetDiariesParams): Promise<DiaryResponse> {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: true,
        diaries: [],
        hasMore: false,
      };
    }

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
      .eq("user_id", user.id);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (emotions?.length) {
      query = query.in("diary_emotions.emotion_id", emotions);
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

    const formattedDiaries: Diary[] = (diaries ?? []).map((diary: any) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      userId: diary.user_id,
      createdAt: diary.created_at ? new Date(diary.created_at) : new Date(),
      updatedAt: diary.updated_at ? new Date(diary.updated_at) : new Date(),
      isPrivate: diary.is_private ?? false,
      diaryEmotion:
        diary.diary_emotions
          ?.map((item: any) => ({
            emotion: {
              id: item.emotions?.id ?? "",
              label: item.emotions?.label ?? "",
            },
            diaryId: item.diary_id,
            emotionId: item.emotion_id,
          }))
          .filter((item: any) => item.emotion.id) ?? [],
      images:
        diary.diary_images
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((image: any) => ({
            id: image.id,
            url: image.image_url,
            order: image.sort_order,
            diaryId: image.diary_id,
          })) ?? [],
      tags:
        diary.diary_tags
          ?.map((item: any) => ({
            tag: {
              id: item.tags?.id ?? "",
              name: item.tags?.name ?? "",
            },
            diaryId: item.diary_id,
            tagId: item.tag_id,
          }))
          .filter((item: any) => item.tag.id) ?? [],
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
