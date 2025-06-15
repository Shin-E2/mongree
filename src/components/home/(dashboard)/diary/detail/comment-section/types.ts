import { ICommentWithUser } from "@/commons/components/comment/types";
import { UserBasicInfo } from "../types";

export interface CommentSectionProps {
  diaryId: string;
  loginUser: UserBasicInfo | null;
  comments: ICommentWithUser[] | null;
  commentCount: number;
  setShowReplyForm: (commentId: string | null) => void;
} 