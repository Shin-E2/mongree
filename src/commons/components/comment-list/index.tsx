"use client";

import { DiaryComment, DiaryReply } from "@/commons/components/comment-item";
import { CommentForm } from "@/commons/components/comment-form";
import type { ICommentListProps as CommentListProps } from "./types";
import styles from "./styles.module.css";

export function CommentList({
  comments,
  loginUser,
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
            currentUserId={currentUserId ?? undefined}
            onReply={() => onReply(comment.id)}
            isOwner={comment.user?.id === currentUserId}
          />

          {showReplyForm === comment.id && currentUserId && (
            <div className={styles.replyContainer}>
              <CommentForm
                user={loginUser ?? null}
                diaryId={diaryId}
                parentId={comment.id}
                isReply
                onSuccess={() => onReply(null)}
              />
            </div>
          )}

          {comment.replies?.map((reply) => (
            <div key={reply.id} className={styles.replyItem}>
              <DiaryReply
                reply={reply}
                diaryId={diaryId}
                currentUserId={currentUserId ?? undefined}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
