"use server";

import { createClient } from "@/lib/supabase-server";

export async function getDiaryDetail(diaryId: string) {
  try {
    const supabase = await createClient();

    const { data: diary, error } = await supabase
      .from('Diary')
      .select(
        `
        *,
        user (
          id,
          name,
          nickname,
          profileImage
        ),
        DiaryImage (
          id,
          url,
          order
        ),
        DiaryEmotion (
          emotionId,
          Emotion (
            id,
            label,
            image
          )
        ),
        DiaryEmpathy (
          id,
          createdAt,
          user (
            id,
            name,
            profileImage
          )
        ),
        DiaryTag (
          tagId,
          Tag (
            id,
            name
          )
        ),
        comments: Comment (
          *,
          user (
            id,
            name,
            profileImage
          ),
          CommentLike (
            id,
            userId
          ),
          replies: Comment (
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
          )
        )
        `
      )
      .eq('id', diaryId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase 일기 상세 조회 오류:', error);
      throw new Error(error.message || "일기 상세 정보를 불러오는데 실패했습니다.");
    }

    if (!diary) {
      throw new Error("일기를 찾을 수 없습니다.");
    }

    const formatComment = (comment: any): any => ({
      ...comment,
      user: comment.user,
      likes: comment.CommentLike || [],
      replies: comment.replies?.map((reply: any) => formatComment(reply)) || [],
    });

    const formattedDiary = {
      ...diary,
      user: diary.user,
      images: diary.DiaryImage || [],
      diaryEmotion: diary.DiaryEmotion?.map((de: any) => de.Emotion).filter((e: any) => e !== null) || [],
      empathies: diary.DiaryEmpathy || [],
      tags: diary.DiaryTag?.map((dt: any) => dt.Tag).filter((t: any) => t !== null) || [],
      comments: diary.comments?.map((comment: any) => formatComment(comment)).filter((comment: any) => comment.parentId === null) || [],
    };

    return formattedDiary;
  } catch (error) {
    console.error("일기 조회 중 오류:", error);
    throw error;
  }
}
