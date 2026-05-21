import type { createClient } from "@/lib/supabase-server";
import type { Tables } from "@/lib/supabase.types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface MongiInventoryItem {
  id: string;
  name: string;
  description: string;
  slot: string;
  assetUrl: string | null;
  owned: boolean;
  equipped: boolean;
}

type MongiItemRow = Tables<"mongi_items">;
type UserMongiItemRow = Tables<"user_mongi_items">;
type MongiProfileRow = Tables<"mongi_profiles">;

export async function ensureDefaultMongiItems(
  supabase: SupabaseClient,
  userId: string
) {
  const { data: defaultItems, error } = await supabase
    .from("mongi_items")
    .select("id")
    .eq("is_default", true);

  if (error || !defaultItems || defaultItems.length === 0) return;

  await supabase.from("user_mongi_items").upsert(
    defaultItems.map((item) => ({
      user_id: userId,
      item_id: item.id,
      source: "default",
    })),
    { onConflict: "user_id,item_id" }
  );
}

export async function getMongiInventory(
  supabase: SupabaseClient,
  userId: string
) {
  await ensureDefaultMongiItems(supabase, userId);

  const [{ data: items }, { data: ownedRows }, { data: profile }] =
    await Promise.all([
      supabase
        .from("mongi_items")
        .select("id, name, description, slot, asset_url, sort_order")
        .order("sort_order", { ascending: true })
        .returns<Pick<MongiItemRow, "id" | "name" | "description" | "slot" | "asset_url" | "sort_order">[]>(),
      supabase
        .from("user_mongi_items")
        .select("item_id")
        .eq("user_id", userId)
        .returns<Pick<UserMongiItemRow, "item_id">[]>(),
      supabase
        .from("mongi_profiles")
        .select("equipped_item_id")
        .eq("user_id", userId)
        .maybeSingle()
        .returns<Pick<MongiProfileRow, "equipped_item_id"> | null>(),
    ]);

  const ownedItemIds = new Set((ownedRows ?? []).map((row) => row.item_id));
  const equippedItemId = profile?.equipped_item_id ?? null;

  return (items ?? []).map((item): MongiInventoryItem => ({
    id: item.id,
    name: item.name,
    description: item.description,
    slot: item.slot,
    assetUrl: item.asset_url,
    owned: ownedItemIds.has(item.id),
    equipped: item.id === equippedItemId,
  }));
}

export async function equipMongiItem({
  supabase,
  userId,
  itemId,
}: {
  supabase: SupabaseClient;
  userId: string;
  itemId: string;
}) {
  const { data: ownedItem } = await supabase
    .from("user_mongi_items")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .maybeSingle()
    .returns<Pick<UserMongiItemRow, "item_id"> | null>();

  if (!ownedItem) {
    return {
      success: false as const,
      error: "보유한 몽이 아이템만 장착할 수 있습니다.",
    };
  }

  const { error } = await supabase.from("mongi_profiles").upsert(
    {
      user_id: userId,
      equipped_item_id: itemId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return {
      success: false as const,
      error: `몽이 아이템을 장착하지 못했습니다. ${error.message}`,
    };
  }

  return {
    success: true as const,
    itemId,
  };
}
