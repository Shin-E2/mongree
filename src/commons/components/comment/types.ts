import { Database } from "@/lib/supabase.types";
import { UserBasicInfo } from "@/components/home/(dashboard)/diary/detail/types";

type CommentsRow = Database['public']['Tables']['comments']['Row'];

export interface ICommentWithUser extends CommentsRow {
  user: UserBasicInfo | null;
} 