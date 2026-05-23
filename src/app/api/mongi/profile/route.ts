import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import type { Tables } from "@/lib/supabase.types";

export const dynamic = "force-dynamic";

type MongiProfileRow = Pick<
  Tables<"mongi_profiles">,
  | "level"
  | "streak_days"
  | "cloud_points"
  | "experience"
  | "equipped_head_id"
  | "equipped_neck_id"
  | "equipped_body_id"
  | "equipped_face_id"
>;

export async function GET() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: mongi } = await supabase
    .from("mongi_profiles")
    .select(
      "level, streak_days, cloud_points, experience, equipped_head_id, equipped_neck_id, equipped_body_id, equipped_face_id"
    )
    .eq("user_id", user.id)
    .maybeSingle()
    .returns<MongiProfileRow | null>();

  return NextResponse.json({
    level: mongi?.level ?? 1,
    streakDays: mongi?.streak_days ?? 0,
    cloudPoints: mongi?.cloud_points ?? 0,
    experience: mongi?.experience ?? 0,
    nickname: user.nickname,
    equippedSlots: {
      head: mongi?.equipped_head_id ?? null,
      neck: mongi?.equipped_neck_id ?? null,
      body: mongi?.equipped_body_id ?? null,
      face: mongi?.equipped_face_id ?? null,
    },
  });
}
