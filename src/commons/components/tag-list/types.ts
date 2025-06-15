import type { Database, Tables } from "@/lib/supabase.types";

export interface TagListProps {
  tags: { tag: Tables<'tags'> }[];
} 