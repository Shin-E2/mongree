"use server";

import { createClient } from "@/lib/supabase-server"; // Supabase 서버 클라이언트 임포트
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDiary(diaryId: string) {
  try {
    const user = await getUser();
    const supabase = await createClient(); // Supabase 클라이언트 초기화

    const { data: diary, error: findError } = await supabase
      .from("diary")
      .select("userId")
      .eq("id", diaryId)
      .single();

    if (findError || !diary || diary.userId !== user.id) {
      console.error("Error finding diary or unauthorized:", findError);
      return { error: "삭제 권한이 없거나 일기를 찾을 수 없습니다" };
    }

    const { error: deleteError } = await supabase
      .from("diary")
      .delete()
      .eq("id", diaryId);

    if (deleteError) {
      console.error("Error deleting diary:", deleteError);
      return { error: "일기 삭제에 실패했습니다" };
    }

    revalidateTag(`diary-${diaryId}`);
    redirect("/diary");
  } catch (error) {
    console.error("Unexpected error in deleteDiary:", error);
    return { error: "일기 삭제에 실패했습니다" };
  }
}

// 공감하기 토글
export async function toggleEmpathy(diaryId: string) {
  try {
    const user = await getUser();
    const supabase = await createClient(); // Supabase 클라이언트 초기화

    const { data: existingEmpathy, error: findEmpathyError } = await supabase
      .from("diaryEmpathy")
      .select("id")
      .eq("userId", user.id)
      .eq("diaryId", diaryId)
      .single();

    if (findEmpathyError && findEmpathyError.code !== "PGRST116") {
      // PGRST116은 single() 결과 없음 오류
      console.error("Error finding empathy:", findEmpathyError);
      return { error: "공감 처리 중 오류가 발생했습니다" };
    }

    if (existingEmpathy) {
      const { error: deleteEmpathyError } = await supabase
        .from("diaryEmpathy")
        .delete()
        .eq("id", existingEmpathy.id);

      if (deleteEmpathyError) {
        console.error("Error deleting empathy:", deleteEmpathyError);
        return { error: "공감 취소에 실패했습니다" };
      }
    } else {
      const { error: createEmpathyError } = await supabase
        .from("diaryEmpathy")
        .insert({ userId: user.id, diaryId: diaryId });

      if (createEmpathyError) {
        console.error("Error creating empathy:", createEmpathyError);
        return { error: "공감 추가에 실패했습니다" };
      }
    }

    revalidateTag(`diary-empathies-${diaryId}`);

    const { data: updatedEmpathies, error: fetchEmpathiesError } =
      await supabase
        .from("diaryEmpathy")
        .select("*, user:users(id, name, profileImage)") // 'users' 테이블명과 관계에 따라 조정 필요
        .eq("diaryId", diaryId)
        .order("createdAt", { ascending: false })
        .limit(3);

    if (fetchEmpathiesError) {
      console.error("Error fetching updated empathies:", fetchEmpathiesError);
      return { error: "공감 목록을 불러오는 데 실패했습니다" };
    }

    return {
      success: true,
      empathies: updatedEmpathies,
      isEmpathized: !existingEmpathy,
    };
  } catch (error) {
    console.error("Unexpected error in toggleEmpathy:", error);
    return { error: "공감 처리에 실패했습니다" };
  }
}

// 댓글 수 계산 (대댓글 포함)
export async function getCommentCount(diaryId: string) {
  try {
    const supabase = await createClient(); // Supabase 클라이언트 초기화

    const { count: comments, error: commentCountError } = await supabase
      .from("comment")
      .select("*", { count: "exact" })
      .eq("diaryId", diaryId);

    if (commentCountError) {
      console.error("Error counting comments:", commentCountError);
      return 0; // 또는 에러 처리 방식에 따라 변경
    }

    const { count: replies, error: replyCountError } = await supabase
      .from("comment")
      .select("*", { count: "exact" })
      .eq("diaryId", diaryId)
      .not("parentId", "is", null);

    if (replyCountError) {
      console.error("Error counting replies:", replyCountError);
      return 0; // 또는 에러 처리 방식에 따라 변경
    }

    return (comments || 0) + (replies || 0);
  } catch (error) {
    console.error("Unexpected error in getCommentCount:", error);
    return 0;
  }
}
