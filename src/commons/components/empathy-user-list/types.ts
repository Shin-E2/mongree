import { Database } from "@/lib/supabase.types";

type User = Database["public"]["Tables"]["profiles"]["Row"];

export interface IEmpathyUserListProps {
  users: {
    id: string;
    profileImage: string | null;
  }[];
  maxCount?: number;
  className?: string;
} 