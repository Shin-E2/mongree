import { createClient } from "@/lib/supabase-server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export function normalizeTagNames(tagNames: string[]): string[] {
  return Array.from(
    new Set(tagNames.map((tagName) => tagName.trim()).filter(Boolean))
  );
}

export async function processTagsAndGetIds(
  supabase: SupabaseClient,
  tagNames: string[]
): Promise<string[]> {
  const normalizedTagNames = normalizeTagNames(tagNames);
  if (normalizedTagNames.length === 0) return [];

  const tagIds: string[] = [];

  for (const tagName of normalizedTagNames) {
    const { data: existing, error: findError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagName)
      .maybeSingle();

    if (findError) {
      throw new Error(`태그 조회 실패: ${findError.message}`);
    }

    if (existing) {
      tagIds.push(existing.id);
      continue;
    }

    const { data: created, error: createError } = await supabase
      .from("tags")
      .insert({ name: tagName })
      .select("id")
      .single();

    if (createError) {
      throw new Error(`태그 생성 실패: ${createError.message}`);
    }

    tagIds.push(created.id);
  }

  return tagIds;
}
