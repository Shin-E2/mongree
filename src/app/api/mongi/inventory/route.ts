import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { getMongiInventory } from "@/lib/mongi/inventory";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = await createClient();
  const items = await getMongiInventory(supabase, user.id);

  return NextResponse.json({ items });
}
