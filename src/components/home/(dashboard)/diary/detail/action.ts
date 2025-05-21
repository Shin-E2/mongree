"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDiary(diaryId: string) {
  try {
    const user = await getUser();
    const diary = await db.diary.findUnique({
      where: { id: diaryId },
      select: { userId: true },
    });

    if (!diary || diary.userId !== user.id) {
      return { error: "삭제 권한이 없습니다" };
    }

    await db.diary.delete({
      where: { id: diaryId },
    });

    revalidateTag(`diary-${diaryId}`);
    redirect("/diary"); // 서버 액션에서 직접 리다이렉트
  } catch (error) {
    return { error: "일기 삭제에 실패했습니다" };
  }
}

// 공감하기 토글
export async function toggleEmpathy(diaryId: string) {
  try {
    const user = await getUser();

    const existingEmpathy = await db.diaryEmpathy.findUnique({
      where: {
        userId_diaryId: {
          userId: user.id,
          diaryId,
        },
      },
    });

    if (existingEmpathy) {
      await db.diaryEmpathy.delete({
        where: {
          id: existingEmpathy.id,
        },
      });
    } else {
      await db.diaryEmpathy.create({
        data: {
          userId: user.id,
          diaryId,
        },
      });
    }

    // 공감 관련 태그만 재검증
    revalidateTag(`diary-empathies-${diaryId}`);

    const updatedEmpathies = await db.diaryEmpathy.findMany({
      where: { diaryId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return {
      success: true,
      empathies: updatedEmpathies,
      isEmpathized: !existingEmpathy,
    };
  } catch (error) {
    return { error: "공감 처리에 실패했습니다" };
  }
}

// 댓글 수 계산 (대댓글 포함)
export async function getCommentCount(diaryId: string) {
  const comments = await db.comment.count({
    where: { diaryId },
  });

  const replies = await db.comment.count({
    where: {
      diaryId,
      NOT: {
        parentId: null,
      },
    },
  });

  return comments + replies;
}
