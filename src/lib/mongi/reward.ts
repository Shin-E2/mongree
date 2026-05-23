import type { createClient } from "@/lib/supabase-server";
import type { Tables } from "@/lib/supabase.types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
type MongiProfileRow = Tables<"mongi_profiles">;

const XP_PER_DIARY = 10;
const XP_STREAK_BONUS = 5;

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4500];

function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

function getLocalDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isConsecutiveDay(lastDate: string | null, today: string): boolean {
  if (!lastDate) return false;
  const last = new Date(lastDate);
  const curr = new Date(today);
  const diffMs = curr.getTime() - last.getTime();
  return diffMs >= 86400000 && diffMs < 172800000;
}

export interface DiaryRewardResult {
  xpGained: number;
  streakDays: number;
  cloudPointsGained: number;
  alreadyRewarded: boolean;
}

export async function awardMongiDiaryReward(
  supabase: SupabaseClient,
  userId: string
): Promise<DiaryRewardResult> {
  const today = getLocalDateKey(new Date());

  const { data: existing } = await supabase
    .from("mongi_profiles")
    .select("experience, level, streak_days, last_rewarded_diary_date, cloud_points")
    .eq("user_id", userId)
    .maybeSingle()
    .returns<Pick<MongiProfileRow, "experience" | "level" | "streak_days" | "last_rewarded_diary_date" | "cloud_points"> | null>();

  if (existing?.last_rewarded_diary_date === today) {
    return { xpGained: 0, streakDays: existing.streak_days ?? 1, cloudPointsGained: 0, alreadyRewarded: true };
  }

  const currentXp = existing?.experience ?? 0;
  const currentStreak = existing?.streak_days ?? 0;
  const currentPoints = existing?.cloud_points ?? 0;

  const streak = isConsecutiveDay(existing?.last_rewarded_diary_date ?? null, today)
    ? currentStreak + 1
    : 1;

  const streakBonus = streak >= 3 ? XP_STREAK_BONUS : 0;
  const xpGained = XP_PER_DIARY + streakBonus;
  const newXp = currentXp + xpGained;
  const newLevel = xpToLevel(newXp);

  if (existing) {
    await supabase.from("mongi_profiles").update({
      experience: newXp,
      level: newLevel,
      streak_days: streak,
      last_rewarded_diary_date: today,
      cloud_points: currentPoints + xpGained,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId);
  } else {
    await supabase.from("mongi_profiles").insert({
      user_id: userId,
      experience: newXp,
      level: newLevel,
      streak_days: streak,
      last_rewarded_diary_date: today,
      cloud_points: xpGained,
    });
  }

  return { xpGained, streakDays: streak, cloudPointsGained: xpGained, alreadyRewarded: false };
}
