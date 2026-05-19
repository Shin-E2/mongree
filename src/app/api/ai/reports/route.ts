import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/get-user";
import {
  AI_FREE_MONTHLY_LIMIT,
  AI_PAID_MONTHLY_LIMIT,
  buildLocalReport,
  buildOpenAiReport,
  currentMonth,
  getMonthRange,
  monthPattern,
  parseMonthFromRequest,
  serializeStoredReport,
  type AiReport,
  type AiReportDiaryForGeneration,
  type StoredAiReportRow,
} from "@/lib/ai-report/core";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function getStoredReport(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  month: string
) {
  return supabase
    .from("ai_reports")
    .select("month, summary, dominant_emotions, gentle_insight, recommendations, source")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle()
    .returns<StoredAiReportRow>();
}

async function hasActiveSubscription(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.current_period_end) return false;

  return (
    ["active", "trialing"].includes(data.status) &&
    new Date(data.current_period_end).getTime() > Date.now()
  );
}

async function getMonthlyAiUsage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  month: string
) {
  const { start, end } = getMonthRange(month);
  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", "ai_report.generated")
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) {
    throw new Error(`AI 사용량을 확인하지 못했습니다: ${error.message}`);
  }

  return count ?? 0;
}

export async function GET(request: Request) {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const month = parseMonthFromRequest(request);
  if (!month) {
    return NextResponse.json(
      { error: "month는 YYYY-MM 형식이어야 합니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await getStoredReport(supabase, user.id, month);

  if (error) {
    return NextResponse.json(
      { error: `AI 리포트를 불러오지 못했습니다: ${error.message}` },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "저장된 AI 리포트가 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(serializeStoredReport(data));
}

export async function POST(request: Request) {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    month?: string;
    explicitConsent?: boolean;
  };
  const month = body.month ?? currentMonth();

  if (!monthPattern.test(month)) {
    return NextResponse.json(
      { error: "month는 YYYY-MM 형식이어야 합니다." },
      { status: 400 }
    );
  }

  if (body.explicitConsent !== true) {
    return NextResponse.json(
      { error: "일기 내용이 외부 AI API로 전송될 수 있음에 동의해야 합니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const existing = await getStoredReport(supabase, user.id, month);

  if (existing.error) {
    return NextResponse.json(
      { error: `AI 리포트를 확인하지 못했습니다: ${existing.error.message}` },
      { status: 500 }
    );
  }

  if (existing.data) {
    return NextResponse.json({
      ...serializeStoredReport(existing.data),
      cached: true,
    });
  }

  const paid = await hasActiveSubscription(supabase, user.id);
  const monthlyLimit = paid ? AI_PAID_MONTHLY_LIMIT : AI_FREE_MONTHLY_LIMIT;
  const usageCount = await getMonthlyAiUsage(supabase, user.id, month);

  if (usageCount >= monthlyLimit) {
    return NextResponse.json(
      { error: "이번 달 AI 리포트 생성 한도를 모두 사용했습니다." },
      { status: 429 }
    );
  }

  const { start, end } = getMonthRange(month);
  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      title,
      content,
      created_at,
      diary_emotions (
        emotions (
          label
        )
      )
      `
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: true })
    .returns<AiReportDiaryForGeneration[]>();

  if (error) {
    return NextResponse.json(
      { error: `AI 리포트용 일기를 불러오지 못했습니다: ${error.message}` },
      { status: 500 }
    );
  }

  const diaries = data ?? [];
  const openAiReport = await buildOpenAiReport(month, diaries).catch(() => null);
  const generatedReport = openAiReport
    ? ({ month, ...openAiReport, source: "openai" } satisfies AiReport)
    : buildLocalReport(month, diaries);

  await supabase.from("ai_reports").upsert(
    {
      user_id: user.id,
      month,
      summary: generatedReport.summary,
      dominant_emotions: generatedReport.dominantEmotions,
      gentle_insight: generatedReport.gentleInsight,
      recommendations: generatedReport.recommendations,
      source: generatedReport.source,
      payload: JSON.parse(JSON.stringify(generatedReport)),
    },
    { onConflict: "user_id,month" }
  );

  await supabase.from("usage_events").insert({
    user_id: user.id,
    event_type: "ai_report.generated",
    source: "api",
    metadata: {
      month,
      source: generatedReport.source,
      paid,
      limit: monthlyLimit,
    },
  });

  return NextResponse.json(generatedReport);
}

export async function DELETE(request: Request) {
  const user = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const month = parseMonthFromRequest(request);
  if (!month) {
    return NextResponse.json(
      { error: "month는 YYYY-MM 형식이어야 합니다." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("ai_reports")
    .delete()
    .eq("user_id", user.id)
    .eq("month", month);

  if (error) {
    return NextResponse.json(
      { error: `AI 리포트를 삭제하지 못했습니다: ${error.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "리포트를 삭제했습니다." });
}
