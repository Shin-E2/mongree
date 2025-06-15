"use server";

import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import type { GetDiariesParams, DiaryResponse, Diary } from "./types";

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
      console.warn("getDiaries 함수: 사용자 정보가 없어 일기를 불러올 수 없습니다.");
      return {
        success: true,
        diaries: [],
        hasMore: false,
      };
    }
    const supabase = await createClient();
    const skip = (page - 1) * ITEMS_PER_PAGE;

    let query = supabase
      .from('Diary')
      .select(
        `
        id,
        title,
        content,
        createdAt,
        updatedAt,
        isPrivate,
        userId,
        DiaryEmotion (
          emotionId,
          diaryId,
          Emotion (
            id,
            label
          )
        ),
        DiaryImage (
          id,
          url,
          order,
          diaryId
        ),
        DiaryTag (
          tagId,
          diaryId,
          Tag (
            id,
            name
          )
        )
        `,
        { count: 'exact' }
      )
      .eq('userId', user.id);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (emotions?.length) {
      const emotionIds = emotions.join(',');
      query = query.filter('id', 'in', 
        `(select "diaryId" from "DiaryEmotion" where "emotionId" in (${emotionIds}))`
      );
    }

    if (dateRange?.start && dateRange?.end) {
      query = query
        .gte('createdAt', dateRange.start.toISOString())
        .lte('createdAt', dateRange.end.toISOString());
    }

    const { data: diaries, error: diariesError, count } = await query
      .order('createdAt', { ascending: false })
      .range(skip, skip + ITEMS_PER_PAGE - 1);

    if (diariesError) {
      console.error('Supabase 일기 조회 오류:', diariesError);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        error: diariesError.message || "일기를 불러오는데 실패했습니다.",
      };
    }

    // 타입 안전한 데이터 포맷팅
    const formattedDiaries: Diary[] = diaries?.map(diary => {
      const { DiaryEmotion, DiaryImage, DiaryTag, ...baseData } = diary;
      
      return {
        id: baseData.id,
        title: baseData.title,
        content: baseData.content,
        userId: baseData.userId,
        // 날짜 타입 변환
        createdAt: baseData.createdAt ? new Date(baseData.createdAt) : new Date(),
        updatedAt: baseData.updatedAt ? new Date(baseData.updatedAt) : new Date(),
        // isPrivate null 처리
        isPrivate: baseData.isPrivate ?? false,
        
        // DiaryEmotionItem[] 타입에 맞게 변환
        diaryEmotion: DiaryEmotion?.map((de: any) => ({
          emotion: {
            id: de.Emotion?.id || '',
            label: de.Emotion?.label || '',
          },
          diaryId: de.diaryId,
          emotionId: de.emotionId,
        })).filter((item: any) => item.emotion.id) || [],
        
        // DiaryImageItem[] 타입에 맞게 변환
        images: DiaryImage?.map((image: any) => ({
          id: image.id,
          url: image.url,
          order: image.order,
          diaryId: image.diaryId,
        })) || [],
        
        // DiaryTagItem[] 타입에 맞게 변환
        tags: DiaryTag?.map((dt: any) => ({
          tag: {
            id: dt.Tag?.id || '',
            name: dt.Tag?.name || '',
          },
          diaryId: dt.diaryId,
          tagId: dt.tagId,
        })).filter((item: any) => item.tag.id) || [],
      };
    }) || [];

    const totalCount = count || 0;

    return {
      success: true,
      diaries: formattedDiaries,
      hasMore: skip + ITEMS_PER_PAGE < totalCount,
    };
  } catch (error) {
    console.error('getDiaries 함수 오류:', error);
    return {
      success: false,
      diaries: [],
      hasMore: false,
      error: "일기를 불러오는데 실패했습니다.",
    };
  }
}
