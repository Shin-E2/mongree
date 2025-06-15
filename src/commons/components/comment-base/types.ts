import { Database } from "@/lib/supabase.types";

// profiles 테이블 기반 사용자 정보 타입 정의
type UserProfileForComment = Pick<Database['public']['Tables']['profiles']['Row'], "id" | "username" | "profile_image">;

export interface ICommentBaseProps {
  user: UserProfileForComment | null; // profiles 테이블 기반 사용자 정보
  content: string;
  // createdAt: Date | undefined; // Supabase에서는 string 또는 null
  createdAt: string | null; // 타입 변경
  likesCount: number;
  isLiked?: boolean;
  isOwner?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onDelete?: () => void;
  cssprop: string;
  className?: string;
} 