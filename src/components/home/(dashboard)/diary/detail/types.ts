import type {
  Database,
  Tables
} from "@/lib/supabase.types";
import type { ICommentWithUser } from "@/commons/components/comment/types";

// profiles 테이블 기반 사용자 기본 정보 타입 정의
export type UserBasicInfo = Pick<Database['public']['Tables']['profiles']['Row'], "id" | "username" | "profile_image">;

// profiles 테이블 기반 사용자 기본 정보 타입
export type UserBasicInfoForDetail = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "username" | "profile_image"
>;

// optimisticEmpathies 배열 요소의 사용자 정보 타입
export type EmpathyUserForDetail = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "profile_image"
>;

export interface DiaryWithRelations extends Omit<Tables<'diaries'>, "user_id"> {
  user: UserBasicInfo | null;
  images: Tables<'diary_images'>[] | null;
  diaryEmotion: { emotion: Tables<'emotions'> }[] | null;
  empathies: Tables<'diary_likes'>[] | null;
  tags: { tag: Tables<'tags'> }[] | null;
  comments: ICommentWithUser[] | null;
}

export interface IDiaryDetailProps {
  diary: DiaryWithRelations;
  loginUser: UserBasicInfo | null;
}

// 공감하기 Action 결과 타입
export interface EmpathyActionResult {
  success: boolean;
  error?: string;
  empathies?: (
    Pick<Tables<'diary_likes'>, "id" | "created_at"> &
    {
      user: Pick<Database['public']['Tables']['profiles']['Row'], "id" | "profile_image"> | null;
    }
  )[];
  isEmpathized?: boolean;
}

// 일기 삭제 Action 결과 타입
export interface DiaryActionResult {
  success: boolean;
  error?: string;
}

export type EmpathyRow = Database["public"]["Tables"]["diary_likes"]["Row"];
export type EmpathyWithUser = EmpathyRow & {
  user: Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "profile_image"> | null;
};
