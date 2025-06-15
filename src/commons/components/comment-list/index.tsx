"use client";

import { DiaryComment, DiaryReply } from "@/commons/components/comment-item";
import { CommentForm } from "@/commons/components/comment-form";
import type { CommentListProps } from "./types";
import styles from "./styles.module.css";

export function CommentList({
  comments,
  diaryId,
  currentUserId,
  onReply,
  showReplyForm,
}: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className={styles.emptyMessage}>첫 번째 댓글을 남겨보세요!</div>
    );
  }

  return (
    <div className={styles.container}>
      {comments.map((comment) => (
        <div key={comment.id}>
          <DiaryComment
            comment={comment}
            diaryId={diaryId}
            currentUserId={currentUserId}
            onReply={() => onReply(comment.id)}
            isOwner={comment.user.id === currentUserId}
          />

          {showReplyForm === comment.id && currentUserId && (
            <div className={styles.replyContainer}>
              <CommentForm
                user={comment.user} // 댓글 작성자는 현재 댓글 작성자와 동일
                diaryId={diaryId}
                parentId={comment.id}
                isReply
                onSuccess={() => {
                  onReply(null); // 답글 작성 성공 시 답글 폼 닫기
                }}
              />
            </div>
          )}

          {comment.replies?.map((reply) => (
            <div key={reply.id} className={styles.replyItem}>
              <DiaryReply
                reply={reply}
                diaryId={diaryId}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
