import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import type { Tables } from "@/lib/supabase.types";

export const dynamic = "force-dynamic";

type ItemRow = Pick<
  Tables<"mongi_items">,
  "id" | "name" | "description" | "slot" | "asset_url" | "sort_order" | "price_points" | "requires_pro" | "is_default"
>;
type ProfileRow = Pick<Tables<"mongi_profiles">, "cloud_points" | "equipped_item_id">;

export async function GET() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = await createClient();

  const [{ data: items, error: itemsError }, { data: ownedRows }, { data: profile }] = await Promise.all([
    supabase
      .from("mongi_items")
      .select("id, name, description, slot, asset_url, sort_order, price_points, requires_pro, is_default")
      .order("sort_order", { ascending: true })
      .returns<ItemRow[]>(),
    supabase
      .from("user_mongi_items")
      .select("item_id")
      .eq("user_id", user.id),
    supabase
      .from("mongi_profiles")
      .select("cloud_points, equipped_item_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .returns<ProfileRow | null>(),
  ]);

  if (itemsError) {
    return NextResponse.json({ error: "아이템 목록을 가져오지 못했습니다." }, { status: 500 });
  }

  const ownedIds = new Set((ownedRows ?? []).map((r) => r.item_id));

  return NextResponse.json({
    items: (items ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      slot: item.slot,
      assetUrl: item.asset_url,
      sortOrder: item.sort_order,
      pricePoints: item.price_points,
      requiresPro: item.requires_pro,
      isDefault: item.is_default,
      owned: ownedIds.has(item.id),
      equipped: item.id === (profile?.equipped_item_id ?? null),
    })),
    cloudPoints: profile?.cloud_points ?? 0,
  });
}
