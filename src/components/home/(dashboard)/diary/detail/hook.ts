import { useOptimistic, useState, useTransition } from "react";
import { deleteDiary, toggleEmpathy } from "./action";
import { EmpathyWithUser, IDiaryDetailProps } from "./types";

export default function useDiaryDetail({
  diary,
  loginUser,
}: IDiaryDetailProps & { onDeleted?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const isOwner = diary.user?.id === loginUser?.id;
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [optimisticEmpathies, addOptimisticEmpathy] = useOptimistic<
    EmpathyWithUser[],
    EmpathyWithUser
  >(
    (diary.empathies || []).map((empathy) => ({
      ...empathy,
      user: diary.user?.id === empathy.user_id ? diary.user : null,
    })) as EmpathyWithUser[],
    (state, newEmpathy: EmpathyWithUser) => {
      if (state.some((empathy) => empathy.user?.id === newEmpathy.user?.id)) {
        return state.filter(
          (empathy) => empathy.user?.id !== newEmpathy.user?.id
        );
      }
      return [newEmpathy, ...state.slice(0, 2)];
    }
  );

  const isEmpathized = optimisticEmpathies.some(
    (empathy) => empathy.user?.id === loginUser?.id
  );

  const handleEmpathyToggle = async () => {
    if (!loginUser) return;

    startTransition(async () => {
      const optimisticEmpathy: EmpathyWithUser = {
        id: "temp-id",
        diary_id: diary.id,
        user_id: loginUser.id,
        created_at: new Date().toISOString(),
        user: {
          id: loginUser.id,
          profile_image: loginUser.profile_image,
        },
      };

      addOptimisticEmpathy(optimisticEmpathy);

      const result = await toggleEmpathy(diary.id);
      if (!result.success) {
        addOptimisticEmpathy(optimisticEmpathy);
      }
    });
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    await deleteDiary(diary.id);
  };

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
    setShowReplyForm,
    setShowDeleteModal,
    handleEmpathyToggle,
    handleDelete,
  };
}
