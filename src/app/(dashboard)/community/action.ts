"use server";

import db from "@/lib/db";
import type { GetPublicDiariesParams, PublicDiaryResponse } from "./types";

const ITEMS_PER_PAGE = 12;

export async function getPublicDiaries({
  page,
  searchTerm,
  emotions,
  sortBy = "latest",
}: GetPublicDiariesParams): Promise<PublicDiaryResponse> {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    //공개 일기
    const where = {
      isPrivate: false,
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
    };

    // 정렬 기준
    const orderBy =
      sortBy === "popular"
        ? [
            { empathies: { _count: "desc" } }, //공감
            { comments: { _count: "desc" } }, //댓글
            { createdAt: "desc" }, //생성일
          ]
        : [{ createdAt: "desc" }];

    const [diaries, total] = await Promise.all([
      db.diary.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              profileImage: true,
            },
          },
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
            take: 3, // 3개만 표시
          },
          empathies: {
            include: {
              user: {
                select: {
                  id: true,
                  profileImage: true,
                },
              },
            },
            take: 3,
          },
          _count: {
            select: {
              empathies: true,
              comments: true,
            },
          },
        },
        orderBy: [
          { empathies: { _count: "desc" as const } },
          { comments: { _count: "desc" as const } },
          { createdAt: "desc" as const },
        ],
        take: ITEMS_PER_PAGE,
        skip,
      }),
      db.diary.count({ where }),
    ]);

    return {
      success: true,
      diaries,
      hasMore: skip + ITEMS_PER_PAGE < total,
      total,
    };
  } catch (error) {
    console.error("공개 일기 목록 조회 중 오류 발생:", error);
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
