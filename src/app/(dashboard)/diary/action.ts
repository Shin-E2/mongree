"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/get-user";

interface GetDiariesParams {
  page: number;
  searchTerm?: string;
  emotions?: string[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

const ITEMS_PER_PAGE = 12;

export async function getDiaries({
  page,
  searchTerm,
  emotions,
  dateRange,
}: GetDiariesParams) {
  try {
    const user = await getUser();
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // 필터 조건 구성
    const where = {
      userId: user.id,
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } },
        ],
      }),
      ...(emotions?.length && {
        diaryEmotion: {
          some: {
            emotionId: { in: emotions },
          },
        },
      }),
      ...(dateRange?.start &&
        dateRange?.end && {
          createdAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        }),
    };

    const [diaries, total] = await Promise.all([
      db.diary.findMany({
        where,
        include: {
          diaryEmotion: {
            include: {
              emotion: true,
            },
          },
          images: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: ITEMS_PER_PAGE,
        skip,
      }),
      db.diary.count({ where }),
    ]);

    return {
      success: true,
      diaries,
      total,
      hasMore: skip + ITEMS_PER_PAGE < total,
    };
  } catch (error) {
    return {
      success: false,
      error: "일기를 불러오는데 실패했습니다.",
    };
  }
}
