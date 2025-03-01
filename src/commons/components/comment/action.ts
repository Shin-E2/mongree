"use server";

import { revalidateTag } from "next/cache";
import db from "@/lib/db";
import { getUser } from "@/lib/get-user";

export async function toggleCommentLike(commentId: string, diaryId: string) {
  try {
    const user = await getUser();

    const existingLike = await db.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    if (existingLike) {
      await db.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await db.commentLike.create({
        data: {
          userId: user.id,
          commentId,
        },
      });
    }

    revalidateTag(`comment-${commentId}`);
    revalidateTag(`diary-comments-${diaryId}`);
    return { success: true };
  } catch (error) {
    return { error: "좋아요 처리에 실패했습니다" };
  }
}

export async function addComment(formData: FormData) {
  const user = await getUser();
  const content = formData.get("content") as string;
  const diaryId = formData.get("diaryId") as string;
  const parentId = formData.get("parentId") as string | null;

  if (!content?.trim()) {
    return { error: "내용을 입력해주세요" };
  }

  try {
    // parentId가 실제로 존재하는지 확인
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return { error: "원본 댓글을 찾을 수 없습니다" };
      }

      // 대댓글의 대댓글 방지
      if (parentComment.parentId) {
        return { error: "대댓글에는 답글을 달 수 없습니다" };
      }
    }

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

    revalidateTag(`comments-${diaryId}`);
    if (parentId) {
      revalidateTag(`replies-${parentId}`);
    }

    return { success: true, comment };
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return { error: "댓글 작성에 실패했습니다" };
  }
}

export async function deleteComment(commentId: string, diaryId: string) {
  const user = await getUser();

  try {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, parentId: true },
    });

    if (!comment || comment.userId !== user.id) {
      return { error: "삭제 권한이 없습니다" };
    }

    await db.comment.delete({
      where: { id: commentId },
    });

    // 관련된 태그만 재검증
    revalidateTag(`comments-${diaryId}`);
    if (comment.parentId) {
      revalidateTag(`replies-${comment.parentId}`);
    }

    return { success: true };
  } catch (error) {
    return { error: "댓글 삭제에 실패했습니다" };
  }
}
