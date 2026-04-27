import { Database } from "@/lib/supabase.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface PublicDiary {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  userId: string;
  user: Pick<
    Profile,
    "id" | "user_id" | "username" | "nickname" | "profile_image"
  > | null;
  diaryEmotion: Array<{
    emotion: {
      id: string;
      label: string;
      image: string | null;
    };
    diaryId: string;
    emotionId: string;
  }> | null;
  images: Array<{
    id: string;
    image_url: string;
    sort_order: number;
    diary_id: string;
  }> | null;
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
    diaryId: string;
    tagId: string;
  }> | null;
  empathies: Array<{
    id: string;
    user: Pick<
      Profile,
      "id" | "user_id" | "username" | "nickname" | "profile_image"
    > | null;
    createdAt: Date;
  }> | null;
  _count?: {
    empathies?: number;
    comments?: number;
  } | null;
}

export interface PublicDiaryResponse {
  success: boolean;
  diaries: PublicDiary[];
  hasMore: boolean;
  total: number;
  error?: string;
}

export interface GetPublicDiariesParams {
  page: number;
  searchTerm?: string;
  emotions?: string[];
  sortBy?: "latest" | "popular";
}

export type CommunityLoginUser = Pick<
  Profile,
  "id" | "user_id" | "username" | "nickname" | "profile_image"
> | null;
