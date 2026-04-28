"use server";

import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";

export interface AiReportEmotionStat {
  id: string;
  label: string;
  image: string;
  count: number;
  percentage: number;
}

export interface AiReportTagStat {
  id: string;
  name: string;
  count: number;
}

export interface AiReportDiaryPreview {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AiReportInsight {
  title: string;
  description: string;
}

export interface AiEmotionReportData {
  monthDate: string;
  monthLabel: string;
  diaryCount: number;
  activeDayCount: number;
  longestStreak: number;
  emotionStats: AiReportEmotionStat[];
  tagStats: AiReportTagStat[];
  recentDiaries: AiReportDiaryPreview[];
  insights: AiReportInsight[];
}

interface ReportDiaryRow {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  diary_emotions:
    | {
        emotions: {
          id: string;
          label: string;
          image: string | null;
        } | null;
      }[]
    | null;
  diary_tags:
    | {
        tags: {
          id: string;
          name: string;
        } | null;
      }[]
    | null;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getValidMonth(year?: string, month?: string) {
  const now = new Date();
  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    Number.isInteger(parsedYear) &&
    Number.isInteger(parsedMonth) &&
    parsedYear >= 2000 &&
    parsedYear <= 2100 &&
    parsedMonth >= 1 &&
    parsedMonth <= 12
  ) {
    return { year: parsedYear, month: parsedMonth };
  }

  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function getLongestStreak(dateKeys: string[]) {
  const sortedKeys = Array.from(new Set(dateKeys)).sort();
  if (sortedKeys.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let index = 1; index < sortedKeys.length; index += 1) {
    const prevDate = new Date(`${sortedKeys[index - 1]}T00:00:00`);
    const currentDate = new Date(`${sortedKeys[index]}T00:00:00`);
    const diffDays =
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

function buildInsights({
  diaryCount,
  activeDayCount,
  longestStreak,
  emotionStats,
  tagStats,
}: Pick<
  AiEmotionReportData,
  "diaryCount" | "activeDayCount" | "longestStreak" | "emotionStats" | "tagStats"
>): AiReportInsight[] {
  if (diaryCount === 0) {
    return [
      {
        title: "아직 읽을 기록이 부족합니다",
        description:
          "이번 달 일기를 한 편 이상 작성하면 감정 흐름과 기록 리듬을 함께 정리할 수 있습니다.",
      },
      {
        title: "시작은 짧게 해도 충분합니다",
        description:
          "오늘의 감정 하나와 짧은 문장만 남겨도 다음 리포트의 단서가 됩니다.",
      },
    ];
  }

  const dominantEmotion = emotionStats[0];
  const secondEmotion = emotionStats[1];
  const mainTag = tagStats[0];

  return [
    {
      title: "이번 달 가장 자주 보인 감정",
      description: dominantEmotion
        ? `${dominantEmotion.label} 감정이 ${dominantEmotion.percentage}%로 가장 많이 기록되었습니다. 이 감정이 나타난 날의 일기 내용을 함께 돌아보면 반복되는 상황을 더 쉽게 찾을 수 있습니다.`
        : "감정을 선택한 일기가 아직 적어 대표 감정을 계산하기 어렵습니다.",
    },
    {
      title: "감정의 폭",
      description: secondEmotion
        ? `${dominantEmotion.label} 다음으로 ${secondEmotion.label} 감정이 자주 보였습니다. 한 가지 감정만이 아니라 여러 감정이 함께 기록되고 있어, 단순한 좋고 나쁨보다 더 입체적인 흐름을 볼 수 있습니다.`
        : "이번 달에는 한 감정이 중심에 가깝게 기록되었습니다. 다른 감정이 떠오른 날도 함께 남기면 리포트가 더 풍부해집니다.",
    },
    {
      title: "기록 리듬",
      description: `${activeDayCount}일 동안 일기를 남겼고, 가장 길게 이어진 기록은 ${longestStreak}일입니다. 리듬을 유지하면 AI가 감정 변화의 전후 맥락을 더 잘 읽을 수 있습니다.`,
    },
    {
      title: "자주 등장한 단서",
      description: mainTag
        ? `${mainTag.name} 태그가 가장 자주 등장했습니다. 이 태그와 연결된 일기는 감정이 반복되는 원인을 찾는 좋은 출발점입니다.`
        : "아직 자주 쓰인 태그가 없습니다. 반복되는 상황이나 사람, 장소를 태그로 남기면 감정 원인을 더 잘 묶어볼 수 있습니다.",
    },
  ];
}

export async function getAiEmotionReportData({
  year,
  month,
}: {
  year?: string;
  month?: string;
}): Promise<AiEmotionReportData> {
  const validMonth = getValidMonth(year, month);
  const startOfMonth = new Date(validMonth.year, validMonth.month - 1, 1);
  const startOfNextMonth = new Date(validMonth.year, validMonth.month, 1);
  const monthDate = getLocalDateKey(startOfMonth);
  const monthLabel = `${validMonth.year}년 ${validMonth.month}월 리포트`;

  const emptyData: AiEmotionReportData = {
    monthDate,
    monthLabel,
    diaryCount: 0,
    activeDayCount: 0,
    longestStreak: 0,
    emotionStats: [],
    tagStats: [],
    recentDiaries: [],
    insights: buildInsights({
      diaryCount: 0,
      activeDayCount: 0,
      longestStreak: 0,
      emotionStats: [],
      tagStats: [],
    }),
  };

  const user = await getUser();
  if (!user) return emptyData;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      id,
      title,
      content,
      created_at,
      diary_emotions (
        emotions (
          id,
          label,
          image
        )
      ),
      diary_tags (
        tags (
          id,
          name
        )
      )
      `
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .gte("created_at", startOfMonth.toISOString())
    .lt("created_at", startOfNextMonth.toISOString())
    .order("created_at", { ascending: false })
    .returns<ReportDiaryRow[]>();

  if (error) {
    console.error("AI 감정 리포트 조회 오류:", error);
    return emptyData;
  }

  const diaries = data ?? [];
  const dateKeys = diaries
    .map((diary) =>
      diary.created_at ? getLocalDateKey(new Date(diary.created_at)) : null
    )
    .filter((dateKey): dateKey is string => Boolean(dateKey));

  const emotionCounts = new Map<string, AiReportEmotionStat>();
  const tagCounts = new Map<string, AiReportTagStat>();

  for (const diary of diaries) {
    for (const row of diary.diary_emotions ?? []) {
      const emotion = row.emotions;
      if (!emotion) continue;

      const current = emotionCounts.get(emotion.id);
      emotionCounts.set(emotion.id, {
        id: emotion.id,
        label: emotion.label,
        image: emotion.image ?? `/image/emotions/${emotion.id}.svg`,
        count: (current?.count ?? 0) + 1,
        percentage: 0,
      });
    }

    for (const row of diary.diary_tags ?? []) {
      const tag = row.tags;
      if (!tag) continue;

      const current = tagCounts.get(tag.id);
      tagCounts.set(tag.id, {
        id: tag.id,
        name: tag.name,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  const totalEmotionCount = Array.from(emotionCounts.values()).reduce(
    (sum, emotion) => sum + emotion.count,
    0
  );
  const emotionStats = Array.from(emotionCounts.values())
    .map((emotion) => ({
      ...emotion,
      percentage:
        totalEmotionCount === 0
          ? 0
          : Math.round((emotion.count / totalEmotionCount) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const tagStats = Array.from(tagCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const activeDayCount = new Set(dateKeys).size;
  const longestStreak = getLongestStreak(dateKeys);

  return {
    monthDate,
    monthLabel,
    diaryCount: diaries.length,
    activeDayCount,
    longestStreak,
    emotionStats,
    tagStats,
    recentDiaries: diaries.slice(0, 3).map((diary) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ?? new Date().toISOString(),
    })),
    insights: buildInsights({
      diaryCount: diaries.length,
      activeDayCount,
      longestStreak,
      emotionStats,
      tagStats,
    }),
  };
}
