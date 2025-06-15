export interface Diary {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  diaryEmotion: DiaryEmotionItem[];
  images: DiaryImageItem[];
  tags: DiaryTagItem[];
  userId: string;
}

export interface DiaryEmotionItem {
  emotion: {
    id: string;
    label: string;
  };
  diaryId: string;
  emotionId: string;
}

export interface DiaryImageItem {
  id: string;
  url: string;
  order: number;
  diaryId: string;
}

export interface DiaryTagItem {
  tag: {
    id: string;
    name: string;
  };
  diaryId: string;
  tagId: string;
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
