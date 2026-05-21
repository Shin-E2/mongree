import type { createClient } from "@/lib/supabase-server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
type MongiTableClient = {
  // Supabase generated types on main do not include the new Mongi tables yet.
  // The migration is included here, so table access is isolated in this module.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: (table: string) => any;
};

export interface MongiInventoryItem {
  id: string;
  name: string;
  description: string;
  slot: string;
  assetUrl: string | null;
  owned: boolean;
  equipped: boolean;
}

interface MongiItemRow {
  id: string;
  name: string;
  description: string;
  slot: string;
  asset_url: string | null;
}

interface UserMongiItemRow {
  item_id: string;
}

interface MongiEquipRow {
  equipped_item_id: string | null;
}

const asMongiDb = (supabase: SupabaseClient) =>
  supabase as unknown as MongiTableClient;

export async function ensureDefaultMongiItems(
  supabase: SupabaseClient,
  userId: string
) {
  const mongiDb = asMongiDb(supabase);
  const { data: defaultItems, error } = (await mongiDb
    .from("mongi_items")
    .select("id")
    .eq("is_default", true)) as {
    data: { id: string }[] | null;
    error: { message: string } | null;
  };

  if (error || !defaultItems || defaultItems.length === 0) return;

  await mongiDb.from("user_mongi_items").upsert(
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
  const mongiDb = asMongiDb(supabase);

  const [{ data: items }, { data: ownedRows }, { data: profile }] =
    (await Promise.all([
      mongiDb
        .from("mongi_items")
        .select("id, name, description, slot, asset_url")
        .order("sort_order", { ascending: true }),
      mongiDb
        .from("user_mongi_items")
        .select("item_id")
        .eq("user_id", userId),
      mongiDb
        .from("mongi_profiles")
        .select("equipped_item_id")
        .eq("user_id", userId)
        .maybeSingle(),
    ])) as [
      { data: MongiItemRow[] | null },
      { data: UserMongiItemRow[] | null },
      { data: MongiEquipRow | null },
    ];

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
  const mongiDb = asMongiDb(supabase);
  const { data: ownedItem } = (await mongiDb
    .from("user_mongi_items")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .maybeSingle()) as { data: UserMongiItemRow | null };

  if (!ownedItem) {
    return {
      success: false as const,
      error: "보유한 몽이 아이템만 장착할 수 있습니다.",
    };
  }

  const { error } = (await mongiDb.from("mongi_profiles").upsert(
    {
      user_id: userId,
      equipped_item_id: itemId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )) as { error: { message: string } | null };

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
