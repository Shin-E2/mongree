import type { Database } from "@/lib/supabase.types";
import type { PublicDiary } from "@/app/(dashboard)/community/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface PublicDiaryCardProps {
  diary: PublicDiary;
  loginUser: Pick<
    Profile,
    "id" | "user_id" | "username" | "nickname" | "profile_image"
  > | null;
}

export interface PublicEmpathyActionResult {
  success: boolean;
  error?: string;
  empathies?: {
    id: string;
    user: Pick<Profile, "id" | "user_id" | "username" | "profile_image"> | null;
    createdAt: Date;
  }[];
  count?: number;
  isEmpathized?: boolean;
}
