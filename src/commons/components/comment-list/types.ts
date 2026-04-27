import { ICommentWithUser } from "@/commons/components/comment-item/types";

export interface LoginUserForCommentList {
  id: string;
  nickname: string;
  profile_image: string | null;
}

export interface ICommentListProps {
  comments: ICommentWithUser[];
  loginUser?: LoginUserForCommentList | null;
  currentUserId?: string | null;
  diaryId: string;
  showReplyForm?: string | null;
  onReply: (commentId: string | null) => void;
}