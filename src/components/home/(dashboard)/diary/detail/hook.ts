import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { deleteDiary, toggleEmpathy } from "./action";
import type { IDiaryDetailContentProps } from "./types";

export default function useDiaryDetail({
  diary,
  loginUser,
}: IDiaryDetailContentProps & { onDeleted?: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isOwner = diary.user.id === loginUser?.id;
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // 공감 관련 상태 관리
  const [optimisticEmpathies, addOptimisticEmpathy] = useOptimistic(
    diary.empathies,
    (state, newEmpathy: (typeof diary.empathies)[0]) => {
      if (state.some((e) => e.user.id === newEmpathy.user.id)) {
        return state.filter((e) => e.user.id !== newEmpathy.user.id);
      }
      return [newEmpathy, ...state.slice(0, 2)]; // 최대 3개만 표시
    }
  );

  const isEmpathized = diary.empathies.some(
    (empathy) => empathy.user.id === loginUser?.id
  );

  const handleEmpathyToggle = async () => {
    if (!loginUser) return;

    startTransition(async () => {
      // 낙관적 업데이트
      const optimisticEmpathy = {
        id: "temp-id",
        user: loginUser,
        createdAt: new Date(),
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
    // 서버 액션에서 redirect
    // 서버 액션에서 redirect가 실행되기 전에 UI가 다시 렌더링되는 것을 방지
    setIsDeleted(true); // 미리 삭제된 상태
    await deleteDiary(diary.id);
  };

  // 총 댓글 수 계산 (최상위 댓글 + 대댓글)
  const getTotalCommentCount = () => {
    let count = diary.comments.length;
    diary.comments.forEach((comment) => {
      if (comment.replies) {
        count += comment.replies.length;
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
