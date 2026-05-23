import type { createClient } from "@/lib/supabase-server";
import { AI_FREE_MONTHLY_LIMIT, AI_PAID_MONTHLY_LIMIT, getMonthRange } from "./core";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function hasActiveSubscription(supabase: SupabaseClient, userId: string): Promise<boolean> {
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

export async function getMonthlyAiUsage(supabase: SupabaseClient, userId: string, month: string): Promise<number> {
  const { start, end } = getMonthRange(month);
  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", "ai_report.generated")
    .gte("created_at", start)
    .lt("created_at", end);

  if (error) throw new Error(`AI 사용량을 확인하지 못했습니다: ${error.message}`);
  return count ?? 0;
}

export async function checkAiReportAccess(supabase: SupabaseClient, userId: string, month: string) {
  const [isPro, usageCount] = await Promise.all([
    hasActiveSubscription(supabase, userId),
    getMonthlyAiUsage(supabase, userId, month),
  ]);
  const monthlyLimit = isPro ? AI_PAID_MONTHLY_LIMIT : AI_FREE_MONTHLY_LIMIT;
  return { isPro, canGenerate: usageCount < monthlyLimit, usageCount, monthlyLimit };
}
