"use client";

import type { IDiaryDetailProps } from "./types";
import useDiaryDetail from "./hook";
import { useState } from "react";
import DiaryDetailHeader from "./header";
import EmpathySection from "./empathy-section";
import CommentSection from "./comment-section";
import DiaryDeleteModal from "./diary-delete-modal";
import DiaryContentDisplay from "./content-display";
import { mapDiaryEmotionsToBadgeList } from "./utils";
import styles from "./styles.module.css";

export default function DiaryDetailContent({
  diary,
  loginUser,
}: IDiaryDetailProps) {
  const [deleteError, setDeleteError] = useState("");
  const {
    isOwner,
    setShowDeleteModal,
    optimisticEmpathies,
    handleEmpathyToggle,
    isPending,
    isEmpathized,
    commentCount,
    setShowReplyForm,
    showReplyForm,
    showDeleteModal,
    handleDelete,
  } = useDiaryDetail({ diary, loginUser });

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
        diaryId={diary.id}
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
          showReplyForm={showReplyForm}
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
