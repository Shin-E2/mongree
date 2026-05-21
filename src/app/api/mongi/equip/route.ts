import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { equipMongiItem } from "@/lib/mongi/inventory";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { itemId?: string };
  const itemId = body.itemId?.trim();

  if (!itemId) {
    return NextResponse.json(
      { error: "장착할 몽이 아이템을 선택해주세요." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const result = await equipMongiItem({ supabase, userId: user.id, itemId });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ equippedItemId: result.itemId });
}
