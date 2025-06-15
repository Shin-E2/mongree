"use server";

import { getUser } from "@/lib/get-user";
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
      .from('diaries')
      .select(
        `
        id,
        title,
        content,
        created_at,
        updated_at,
        is_private,
        profiles (
          id,
          nickname,
          profile_image
        ),
        diary_emotions (
          emotion_id,
          emotions (
            id,
            label
          )
        ),
        diary_images (
          id,
          image_url,
          sort_order
        ),
        diary_tags (
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
            profile_image
          )
        ),
        comments (
          id
        )
        `,
        { count: 'exact' }
      )
      .eq('is_private', false);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (emotions?.length) {
      query = query.filter(
        'diary_emotions.emotion_id',
        'in',
        `(${emotions.join(',')})`
      );
    }

    query = query.order('created_at', { ascending: false });

    const [diariesResponse, totalResponse] = await Promise.all([
      query.limit(ITEMS_PER_PAGE).offset(skip),
      supabase.from('diaries').select('id', { count: 'exact' }).eq('is_private', false)
        .or(searchTerm ? [`.or(\`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%\`)`] : [])
        .or(emotions?.length ? [`.filter(\'diary_emotions.emotion_id\', \'in\', \`(${emotions.join(',')})\`)`] : [])
    ]);

    if (diariesResponse.error) {
      console.error('Supabase 공개 일기 목록 조회 오류:', diariesResponse.error);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        total: 0,
        error: diariesResponse.error.message || "일기를 불러오는데 실패했습니다.",
      };
    }

    if (totalResponse.error) {
      console.error('Supabase 공개 일기 개수 계산 오류:', totalResponse.error);
    }

    const formattedDiaries = diariesResponse.data?.map((diary: any) => ({
      ...diary,
      user: diary.profiles,
      diaryEmotion: diary.diary_emotions?.map((de: any) => de.emotions).filter((e: any) => e !== null) || [],
      images: diary.diary_images
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((image: any) => image.image_url) || [],
      tags: diary.diary_tags?.map((dt: any) => dt.tags).filter((t: any) => t !== null) || [],
      empathies: diary.diary_likes?.map((e: any) => ({
         ...e,
         user: e.profiles
      })) || [],
      _count: {
        empathies: diary.diary_likes?.length || 0,
        comments: diary.comments?.length || 0,
      }
    })) || [];

    const total = totalResponse.count || 0;

    return {
      success: true,
      diaries: formattedDiaries as PublicDiary[],
      hasMore: skip + ITEMS_PER_PAGE < total,
      total,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("공개 일기 목록 조회 중 오류 발생:", { message: errorMessage });

    return {
      success: false,
      diaries: [],
      hasMore: false,
      total: 0,
      error: "일기를 불러오는데 실패했습니다.",
    };
  }
}
// 덜덜..
