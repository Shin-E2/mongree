import type {
  Diary,
  DiaryImage,
  User,
  Emotion,
  Tag,
  DiaryEmpathy,
} from "@prisma/client";
import type { ICommentWithUser } from "@/commons/components/comment/types";

type UserBasicInfo = Pick<User, "id" | "name" | "nickname" | "profileImage">;

export interface DiaryWithRelations extends Omit<Diary, "userId"> {
  user: UserBasicInfo;
  images: DiaryImage[];
  diaryEmotion: {
    emotion: Pick<Emotion, "id" | "label">;
  }[];
  empathies: {
    id: string;
    user: Pick<User, "id" | "name" | "profileImage">;
    createdAt: Date;
  }[];
  tags: {
    tag: Pick<Tag, "id" | "name">;
    tagId: string;
  }[];
  comments: ICommentWithUser[];
}

export interface IDiaryDetailContentProps {
  diary: DiaryWithRelations;
  loginUser: Pick<User, "id" | "name" | "profileImage"> | null;
}

// 공감하기 Action 결과 타입
export interface EmpathyActionResult {
  success: boolean;
  error?: string;
  empathies?: Pick<DiaryEmpathy, "id" | "createdAt"> &
    {
      user: Pick<User, "id" | "name" | "profileImage">;
    }[];
  isEmpathized?: boolean;
}

// 일기 삭제 Action 결과 타입
export interface DiaryActionResult {
  success: boolean;
  error?: string;
}
