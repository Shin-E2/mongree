"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteAllProfileComments, deleteProfileComment, type ProfileCommentItem } from "./action";
import styles from "./styles.module.css";

interface CommentsSectionProps {
  comments: ProfileCommentItem[];
  onMessage: (msg: string) => void;
  onRefresh: () => void;
}

export function CommentsSection({ comments, onMessage, onRefresh }: CommentsSectionProps) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm("이 댓글을 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteProfileComment(commentId);
      onMessage(result.success ? "댓글을 삭제했습니다." : result.error ?? "");
      if (result.success) onRefresh();
    });
  };

  const handleDeleteAllComments = () => {
    if (comments.length === 0) return;
    if (!window.confirm("내 댓글을 모두 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteAllProfileComments();
      onMessage(result.success ? "댓글을 모두 삭제했습니다." : result.error ?? "");
      if (result.success) onRefresh();
    });
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>내 댓글</h2>
          <p className={styles.panelDescription}>최근 댓글을 모아보고 정리합니다.</p>
        </div>
        <button
          type="button"
          className={styles.dangerTextButton}
          onClick={handleDeleteAllComments}
          disabled={isPending || comments.length === 0}
        >
          전체 삭제
        </button>
      </div>

      <div className={styles.commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article key={comment.id} className={styles.commentCard}>
              <div className={styles.commentHeader}>
                <div>
                  <p className={styles.commentDiaryTitle}>{comment.diaryTitle}</p>
                  <p className={styles.commentMeta}>{comment.isReply ? "답글" : "댓글"}</p>
                </div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={isPending}
                >
                  삭제
                </button>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
              <Link href={`/diary/${comment.diaryId}`} className={styles.commentLink}>
                일기에서 보기
              </Link>
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>작성한 댓글이 없습니다</p>
            <p className={styles.emptyDescription}>
              공개 일기에 마음을 남기면 이곳에서 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
