"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";

// 공감하기
export async function togglePublicEmpathy(diaryId: string) {
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

    // 공감 관련 태그 재검증
    revalidateTag(`public-diary-${diaryId}`);
    revalidateTag(`public-diaries`);

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

    const empathyCount = await db.diaryEmpathy.count({
      where: { diaryId },
    });

    return {
      success: true,
      empathies: updatedEmpathies,
      count: empathyCount,
      isEmpathized: !existingEmpathy,
    };
  } catch (error) {
    return {
      success: false,
      error: "공감 처리에 실패했습니다",
    };
  }
}
