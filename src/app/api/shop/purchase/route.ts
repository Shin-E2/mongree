import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, { message: string; status: number }> = {
  ITEM_NOT_FOUND: { message: "존재하지 않는 아이템입니다.", status: 404 },
  ITEM_NOT_FOR_SALE: { message: "구매할 수 없는 아이템입니다.", status: 400 },
  ALREADY_OWNED: { message: "이미 보유한 아이템입니다.", status: 409 },
  REQUIRES_PRO: { message: "Pro 플랜에서만 구매할 수 있는 아이템입니다.", status: 403 },
  INSUFFICIENT_POINTS: { message: "구름 포인트가 부족합니다.", status: 402 },
};

export async function POST(request: Request) {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { itemId?: string };
  const itemId = body.itemId?.trim();

  if (!itemId) {
    return NextResponse.json({ error: "구매할 아이템을 선택해주세요." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("purchase_mongi_item", {
    p_user_id: user.id,
    p_item_id: itemId,
  });

  if (error) {
    return NextResponse.json({ error: "구매 중 오류가 발생했습니다." }, { status: 500 });
  }

  const result = data as { success: boolean; error?: string; itemId?: string; pointsSpent?: number; remainingPoints?: number };

  if (!result.success) {
    const mapped = result.error ? ERROR_MESSAGES[result.error] : null;
    return NextResponse.json(
      { error: mapped?.message ?? "구매에 실패했습니다.", code: result.error },
      { status: mapped?.status ?? 400 }
    );
  }

  return NextResponse.json({
    itemId: result.itemId,
    pointsSpent: result.pointsSpent,
    remainingPoints: result.remainingPoints,
  });
}
