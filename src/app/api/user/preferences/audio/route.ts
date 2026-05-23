import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  return NextResponse.json({
    bgmEnabled: false,
    bgmVolume: 0.5,
    bgmTrack: null,
    note: "BGM 기능은 향후 Pro 플랜에서 제공될 예정입니다.",
  });
}

export async function PUT() {
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  return NextResponse.json(
    { error: "BGM 기능은 아직 지원되지 않습니다.", code: "NOT_IMPLEMENTED" },
    { status: 501 }
  );
}
