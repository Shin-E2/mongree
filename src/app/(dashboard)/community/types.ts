// 공개 일기 타입
import { Database, Tables } from "@/lib/supabase.types";

export interface PublicDiary {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  userId: string; // Diary 테이블의 userId는 auth.users의 id를 참조

  // 사용자 정보 (profiles 테이블 참조)
  user: Pick<Database['public']['Tables']['profiles']['Row'], 'user_id' | 'nickname' | 'profile_image'> | null; // profiles 테이블에서 필요한 필드 선택

  // 감정 정보
  diaryEmotion: Array<{
    emotion: {
      id: string;
      label: string;
      // image 필드 추가 (getPublicDiaries 쿼리에서 가져옴)
      image: string;
    };
    diaryId: string;
    emotionId: string;
  }> | null; // null 허용

  // 이미지 정보
  images: Array<{
    id: string;
    image_url: string;
    sort_order: number;
    diary_id: string;
  }> | null; // null 허용

  // 태그 정보
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
    diaryId: string;
    tagId: string;
  }> | null; // null 허용

  // 공감 정보
  empathies: Array<{
    id: string;
    // 공감한 사용자 정보 (profiles 테이블 참조)
    user: Pick<Database['public']['Tables']['profiles']['Row'], 'user_id' | 'profile_image'> | null; // profiles 테이블에서 필요한 필드 선택
    createdAt: Date;
  }> | null; // null 허용

  // 카운트 정보 (RPC 또는 View에서 가져올 경우)
  _count?: { // count 필드는 optional 할 수 있음
    empathies?: number;
    comments?: number;
  } | null;
}

// 공개 일기 응답 타입
export interface PublicDiaryResponse {
  success: boolean;
  diaries: PublicDiary[];
  hasMore: boolean;
  total: number;
  error?: string;
}

// 공개 일기 요청 파라미터
export interface GetPublicDiariesParams {
  page: number;
  searchTerm?: string;
  emotions?: string[];
  sortBy?: "latest" | "popular";
}
