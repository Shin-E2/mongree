export interface Diary {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  diaryEmotion: Array<{
    emotion: {
      id: string;
      label: string;
    };
    diaryId: string;
    emotionId: string;
  }>;
  images: Array<{
    id: string;
    url: string;
    order: number;
    diaryId: string;
  }>;
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
    diaryId: string;
    tagId: string;
  }>;
  userId: string;
}

export interface DiaryResponse {
  success: boolean;
  diaries: Diary[];
  hasMore: boolean;
  error?: string;
}

export interface GetDiariesParams {
  page: number;
  searchTerm?: string;
  emotions?: string[];
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}
