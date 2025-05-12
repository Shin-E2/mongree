// 공개 일기 타입
export interface PublicDiary {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  userId: string;

  // 사용자 정보
  user: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };

  // 감정 정보
  diaryEmotion: Array<{
    emotion: {
      id: string;
      label: string;
    };
    diaryId: string;
    emotionId: string;
  }>;

  // 이미지 정보
  images: Array<{
    id: string;
    url: string;
    order: number;
    diaryId: string;
  }>;

  // 태그 정보
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
    diaryId: string;
    tagId: string;
  }>;

  // 공감 정보
  empathies: Array<{
    id: string;
    user: {
      id: string;
      profileImage: string | null;
    };
  }>;

  // 카운트 정보
  _count: {
    empathies: number;
    comments: number;
  };
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
