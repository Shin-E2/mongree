"use server";

import db from "@/lib/db";

export async function getDiaryDetail(diaryId: string) {
  try {
    const diary = await db.diary.findUnique({
      where: { id: diaryId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            profileImage: true,
          },
        },
        images: true,
        diaryEmotion: {
          include: {
            emotion: true,
          },
        },
        empathies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: {
            parentId: null, // 최상위 댓글만
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            likes: true,
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profileImage: true,
                  },
                },
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!diary) {
      throw new Error("일기를 찾을 수 없습니다.");
    }

    return diary;
  } catch (error) {
    console.error("일기 조회 중 오류:", error);
    throw error;
  }
}
