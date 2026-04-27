import { CommentForm } from "@/commons/components/comment-form";
import { CommentList } from "@/commons/components/comment-list";
import { type CommentSectionProps } from "./types";
import styles from "./styles.module.css";

export default function CommentSection({
  diaryId,
  loginUser,
  comments,
  commentCount,
  showReplyForm,
  setShowReplyForm,
}: CommentSectionProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        댓글 <span className={styles.commentCountText}>({commentCount})</span>
      </h2>
      <CommentForm
        diaryId={diaryId}
        user={loginUser}
        placeholder="댓글을 입력하세요..."
      />
      {comments && (
        <CommentList
          comments={comments}
          loginUser={loginUser}
          currentUserId={loginUser?.id}
          diaryId={diaryId}
          showReplyForm={showReplyForm}
          onReply={(commentId: string | null) => setShowReplyForm(commentId)}
        />
      )}
    </div>
  );
}
