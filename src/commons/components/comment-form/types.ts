import { UserBasicInfo } from "@/components/home/(dashboard)/diary/detail/types";

export interface ICommentFormProps {
  diaryId: string;
  user: UserBasicInfo | null;
  placeholder?: string;
  isReply?: boolean;
  parentId?: string;
  onSuccess?: () => void;
}