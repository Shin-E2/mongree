import type { Database, Tables } from "@/lib/supabase.types";

// Supabase 타입 기반 댓글 타입 정의
export interface ICommentWithUser extends Tables<'comments'> {
  // user: Tables<'User'>; // Assuming 'user' relation is joined - 기존 User 테이블 참조
  // profiles 테이블에서 user_id, username, profile_image 가져온다고 가정
  user: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'username' | 'profile_image'> | null;
  likes: Tables<'comment_likes'>[];
  replies?: ICommentWithUser[] | null; // 대댓글 타입 (재귀적 참조)
}

export interface DiaryCommentProps {
  comment: ICommentWithUser;
  diaryId: string;
  currentUserId?: string;
  onReply?: () => void;
  isOwner?: boolean;
} 