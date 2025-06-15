import { UserBasicInfo } from "@/components/home/(dashboard)/diary/detail/types";

export interface ICommentFormProps {
  diaryId: string;
  user: UserBasicInfo | null;
  placeholder?: string;
  onReply?: (commentId: string | null) => void;
  onCommentSubmitted?: () => void;
  parentCommentId?: string; // 대댓글 작성을 위한 부모 댓글 ID
} 