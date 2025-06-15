import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { deleteDiary, toggleEmpathy } from "./action";
import { IDiaryDetailProps, EmpathyRow, EmpathyWithUser } from "./types";
import { Database } from "@/lib/supabase.types";

export default function useDiaryDetail({
  diary,
  loginUser,
}: IDiaryDetailProps & { onDeleted?: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isOwner = diary.user?.user_id === loginUser?.user_id;
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // 공감 관련 상태 관리
  const [optimisticEmpathies, addOptimisticEmpathy] = useOptimistic<
    EmpathyWithUser[]
  >(
    (diary.empathies || []).map((e) => ({
      ...e,
      user: diary.user?.user_id === e.user_id ? diary.user : null, // 로그인 사용자 정보 연결 (임시)
    })) as EmpathyWithUser[], // 초기 diary.empathies도 타입에 맞게 매핑
    (state, newEmpathy: EmpathyWithUser) => {
      if (state.some((e) => e.user?.id === newEmpathy.user?.id)) {
        return state.filter((e) => e.user?.id !== newEmpathy.user?.id);
      }
      return [newEmpathy, ...state.slice(0, 2)]; // 최대 3개만 표시
    }
  );

  const isEmpathized = optimisticEmpathies.some(
    (empathy) => empathy.user?.id === loginUser?.user_id
  );

  const handleEmpathyToggle = async () => {
    if (!loginUser) return;

    startTransition(async () => {
      const optimisticEmpathy: EmpathyWithUser = {
        id: "temp-id",
        diary_id: diary.id, // diary_id 추가
        user_id: loginUser.user_id, // user_id 추가
        created_at: new Date().toISOString(),
        user: {
          id: loginUser.user_id, // user_id를 id로 매핑
          profile_image: loginUser.profile_image,
        },
      };

      addOptimisticEmpathy(optimisticEmpathy);

      const result = await toggleEmpathy(diary.id);
      if (!result.success) {
        // 실패 시 롤백
        addOptimisticEmpathy(optimisticEmpathy);
      }
    });
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    setIsDeleted(true);
    await deleteDiary(diary.id);
  };

  // 총 댓글 수 계산 (최상위 댓글 + 대댓글) - nullish coalescing 적용
  const getTotalCommentCount = () => {
    let count = (diary.comments ?? []).length;
    (diary.comments ?? []).forEach((comment) => {
      if (comment.replies) {
        count += (comment.replies ?? []).length;
      }
    });
    return count;
  };

  const commentCount = getTotalCommentCount();

  return {
    isOwner,
    isEmpathized,
    showReplyForm,
    showDeleteModal,
    isPending,
    optimisticEmpathies,
    commentCount,
    isDeleted,
    setShowReplyForm,
    setShowDeleteModal,
    handleEmpathyToggle,
    handleDelete,
    router,
  };
}
