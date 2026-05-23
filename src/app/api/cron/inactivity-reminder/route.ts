import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { inactivityReminderEmailHtml } from "@/lib/email/templates/inactivity-reminder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const BATCH_SIZE = 50;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - THREE_DAYS_MS).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  const { data: candidates, error } = await supabase
    .from("mongi_profiles")
    .select("user_id, last_rewarded_diary_date, last_inactivity_email_sent")
    .or(`last_rewarded_diary_date.lte.${threeDaysAgo},last_rewarded_diary_date.is.null`)
    .or(`last_inactivity_email_sent.lt.${threeDaysAgo},last_inactivity_email_sent.is.null`)
    .limit(BATCH_SIZE);

  if (error) {
    console.error("[cron/inactivity] DB 조회 실패:", error.message);
    return NextResponse.json({ error: "DB 조회 실패" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const row of candidates ?? []) {
    const { data: authUser } = await supabase.auth.admin.getUserById(row.user_id);
    const email = authUser?.user?.email;
    if (!email) { skipped++; continue; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", row.user_id)
      .maybeSingle();

    const lastDate = row.last_rewarded_diary_date
      ? new Date(row.last_rewarded_diary_date).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
      : "아직 기록 없음";

    await sendEmail({
      to: email,
      subject: "[Mongree] 몽이가 기다리고 있어요",
      html: inactivityReminderEmailHtml({
        nickname: profile?.username ?? "사용자",
        lastDiaryDate: lastDate,
      }),
    });

    await supabase.from("mongi_profiles").update({
      last_inactivity_email_sent: today,
    }).eq("user_id", row.user_id);

    sent++;
  }

  return NextResponse.json({ sent, skipped, total: (candidates ?? []).length });
}
