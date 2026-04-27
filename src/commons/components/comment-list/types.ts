import { ICommentWithUser } from "@/commons/components/comment-item/types";

export interface ICommentListProps {
  comments: ICommentWithUser[];
  currentUserId?: string | null;
  diaryId: string;
  showReplyForm?: string | null;
  onReply: (commentId: string | null) => void;
}