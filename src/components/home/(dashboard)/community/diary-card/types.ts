import type {
  Database,
  Tables
} from "@/lib/supabase.types";
import type { PublicDiary } from "@/app/(dashboard)/community/types";

export interface PublicDiaryCardProps {
  diary: PublicDiary;
  loginUser: Pick<Database['public']['Tables']['profiles']['Row'], 'user_id' | 'nickname' | 'profile_image'> | null;
}

export interface PublicEmpathyActionResult {
  success: boolean;
  error?: string;
  empathies?: {
    id: string;
    user: Pick<Database['public']['Tables']['profiles']['Row'], 'user_id' | 'profile_image'> | null;
    createdAt: Date;
  }[];
  count?: number;
  isEmpathized?: boolean;
}
