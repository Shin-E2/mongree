"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";

export async function addComment(formData: FormData) {
  const user = await getUser();
  const content = formData.get("content") as string;
  const diaryId = formData.get("diaryId") as string;
  const parentId = formData.get("parentId") as string | null;

  if (!content?.trim()) {
    return { error: "내용을 입력해주세요" };
  }

  try {
    const comment = await db.comment.create({
      data: {
        content,
        userId: user.id,
        diaryId,
        parentId,
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
      },
    });

    // 댓글 목록만 재검증
    revalidateTag(`comments-${diaryId}`);
    if (parentId) {
      revalidateTag(`replies-${parentId}`);
    }

    return { success: true, comment };
  } catch (error) {
    return { error: "댓글 작성에 실패했습니다" };
  }
}
