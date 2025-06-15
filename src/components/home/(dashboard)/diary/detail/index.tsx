"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import type { IDiaryDetailProps } from "./types";
import useDiaryDetail from "./hook";
import { useState } from "react";
import { TagList } from "@/commons/components/tag-list";
import { Database, Tables } from "@/lib/supabase.types";
import UserProfileHeader from "@/commons/components/user-profile-header";
import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import ImageThumbnailList from "@/commons/components/image-thumbnail-list";
import DiaryDetailHeader from "./header";
import EmpathySection from "./empathy-section";
import CommentSection from "./comment-section";
import DiaryDeleteModal from "./diary-delete-modal";
import DiaryContentDisplay from "./content-display";
import { mapDiaryEmotionsToBadgeList } from "./utils";
import DiaryDeletedMessage from "./deleted-message";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export default function DiaryDetailContent({
  diary,
  loginUser,
}: IDiaryDetailProps) {
  const [deleteError, setDeleteError] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();
  const {
    isOwner,
    setShowDeleteModal,
    optimisticEmpathies,
    handleEmpathyToggle,
    isPending,
    isEmpathized,
    commentCount,
    setShowReplyForm,
    showDeleteModal,
    handleDelete,
  } = useDiaryDetail({
    diary,
    loginUser,
    onDeleted: () => setIsDeleted(true),
  });

  if (isDeleted) {
    return <DiaryDeletedMessage onBack={() => router.back()} />;
  }

  const handleDeleteWithError = async () => {
    setDeleteError("");
    try {
      await handleDelete();
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : "삭제에 실패했습니다");
    }
  };

  const emotionsForBadgeList = mapDiaryEmotionsToBadgeList(diary.diaryEmotion);

  return (
    <div className={styles.mainContainer}>
      {/* 상단 네비게이션 */}
      <DiaryDetailHeader
        isOwner={isOwner}
        isPrivate={diary.is_private ?? false}
        setShowDeleteModal={setShowDeleteModal}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.contentArea}>
        {/* 메인 콘텐츠 카드 */}
        <DiaryContentDisplay
          diary={diary}
          emotionsForBadgeList={emotionsForBadgeList}
        />

        {/* 공감 섹션 */}
        <EmpathySection
          optimisticEmpathies={optimisticEmpathies}
          isEmpathized={isEmpathized}
          isPending={isPending}
          loginUser={loginUser}
          handleEmpathyToggle={handleEmpathyToggle}
          isPrivate={diary.is_private ?? false}
        />

        {/* 댓글 섹션 */}
        <CommentSection
          diaryId={diary.id}
          loginUser={loginUser}
          comments={diary.comments}
          commentCount={commentCount}
          setShowReplyForm={setShowReplyForm}
        />
      </div>

      <DiaryDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        deleteError={deleteError}
        isPending={isPending}
        handleDeleteWithError={handleDeleteWithError}
      />
    </div>
  );
}
