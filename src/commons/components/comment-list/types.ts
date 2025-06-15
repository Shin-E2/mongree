import { ICommentWithUser } from "@/commons/components/comment/types";

export interface ICommentListProps {
  comments: ICommentWithUser[];
  loginUserId?: string | null;
  diaryId: string;
  onReply?: () => void;
} 