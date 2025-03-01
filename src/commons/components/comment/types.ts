export interface ICommentWithUser {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  likes: Array<{ userId: string }>;
  replies?: ICommentWithUser[];
}

export interface ICommentBaseProps {
  profileImage: string | null;
  name: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  isLiked?: boolean;
  isOwner?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onDelete?: () => void;
  cssprop: string;
  className?: string;
}

export interface DiaryCommentProps {
  comment: ICommentWithUser;
  diaryId: string;
  currentUserId?: string;
  onReply?: () => void;
  isOwner?: boolean;
}
