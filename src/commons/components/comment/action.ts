"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/get-user";

export async function toggleCommentLike(commentId: string, diaryId: string) {
  try {
    const user = await getUser();
    const supabase = await createClient();

    const { data: existingLike, error: checkError } = await supabase
      .from('CommentLike')
      .select('id')
      .eq('userId', user.id)
      .eq('commentId', commentId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Supabase 댓글 좋아요 확인 오류:', checkError);
      throw new Error('좋아요 상태 확인 중 오류가 발생했습니다.');
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('CommentLike')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Supabase 댓글 좋아요 삭제 오류:', deleteError);
        throw new Error('좋아요 취소 중 오류가 발생했습니다.');
      }
    } else {
      const { error: createError } = await supabase
        .from('CommentLike')
        .insert([{ userId: user.id, commentId }]);

      if (createError) {
        console.error('Supabase 댓글 좋아요 생성 오류:', createError);
        throw new Error('좋아요 처리 중 오류가 발생했습니다.');
      }
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
  const supabase = await createClient();

  if (!content?.trim()) {
    return { error: "내용을 입력해주세요" };
  }

  try {
    if (parentId) {
      const { data: parentComment, error: parentCheckError } = await supabase
        .from('Comment')
        .select('id, parentId')
        .eq('id', parentId)
        .single();

      if (parentCheckError && parentCheckError.code !== 'PGRST116') {
        console.error('Supabase 부모 댓글 확인 오류:', parentCheckError);
        throw new Error('부모 댓글 확인 중 오류가 발생했습니다.');
      }

      if (!parentComment) {
        return { error: "원본 댓글을 찾을 수 없습니다" };
      }

      if (parentComment.parentId) {
        return { error: "대댓글에는 답글을 달 수 없습니다" };
      }
    }

    const { data: comment, error: createCommentError } = await supabase
      .from('Comment')
      .insert({
        content,
        userId: user.id,
        diaryId,
        parentId,
      })
      .select(
        `
        *,
        user (
          id,
          name,
          profileImage
        ),
        CommentLike (
          id,
          userId
        )
        `
      )
      .single();

    if (createCommentError) {
      console.error('Supabase 댓글 생성 오류:', createCommentError);
      throw new Error(createCommentError.message || "댓글 작성에 실패했습니다.");
    }

    revalidateTag(`comments-${diaryId}`);
    if (parentId) {
      revalidateTag(`replies-${parentId}`);
    }

    const formattedComment = {
      ...comment,
      user: comment.user,
      likes: comment.CommentLike || [],
    };

    return { success: true, comment: formattedComment };
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return { error: "댓글 작성에 실패했습니다" };
  }
}

export async function deleteComment(commentId: string, diaryId: string) {
  const user = await getUser();
  const supabase = await createClient();

  try {
    const { data: commentToDelete, error: checkDeleteError } = await supabase
      .from('Comment')
      .select('userId, parentId')
      .eq('id', commentId)
      .single();

    if (checkDeleteError && checkDeleteError.code !== 'PGRST116') {
      console.error('Supabase 댓글 확인 오류:', checkDeleteError);
      throw new Error('댓글 확인 중 오류가 발생했습니다.');
    }

    if (!commentToDelete || commentToDelete.userId !== user.id) {
      return { error: "삭제 권한이 없습니다" };
    }

    const { error: deleteCommentError } = await supabase
      .from('Comment')
      .delete()
      .eq('id', commentId);

    if (deleteCommentError) {
      console.error('Supabase 댓글 삭제 오류:', deleteCommentError);
      throw new Error('댓글 삭제에 실패했습니다.');
    }

    revalidateTag(`comments-${diaryId}`);
    if (commentToDelete.parentId) {
      revalidateTag(`replies-${commentToDelete.parentId}`);
    }

    return { success: true };
  } catch (error) {
    return { error: "댓글 삭제에 실패했습니다" };
  }
}
