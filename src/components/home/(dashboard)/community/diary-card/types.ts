import type { User, DiaryEmpathy } from "@prisma/client";
import type { PublicDiary } from "@/app/(dashboard)/community/types";

export interface PublicDiaryCardProps {
  diary: PublicDiary;
  loginUser: Pick<User, "id" | "name" | "profileImage"> | null;
}

export interface PublicEmpathyActionResult {
  success: boolean;
  error?: string;
  empathies?: {
    id: string;
    user: Pick<User, "id" | "name" | "profileImage">;
    createdAt: Date;
  }[];
  count?: number;
  isEmpathized?: boolean;
}
