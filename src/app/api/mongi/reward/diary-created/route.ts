import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { awardMongiDiaryReward } from "@/lib/mongi/reward";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = await createClient();
  const result = await awardMongiDiaryReward(supabase, user.id);

  if (result.alreadyRewarded) {
    return NextResponse.json(
      { error: "ALREADY_REWARDED", message: "오늘의 보상은 이미 지급되었습니다." },
      { status: 409 }
    );
  }

  return NextResponse.json({
    xpGained: result.xpGained,
    streakDays: result.streakDays,
    cloudPointsGained: result.cloudPointsGained,
  });
}
