"use server";

import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";

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
    const { data: comment, error: createCommentError } = await supabase
      .from("Comment")
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
      console.error("Supabase 댓글 생성 오류:", createCommentError);
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
    return { error: "댓글 작성에 실패했습니다" };
  }
}
