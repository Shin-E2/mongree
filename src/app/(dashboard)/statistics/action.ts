"use server";

import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";

export interface StatisticsSummary {
  diaryCount: number;
  activeDayCount: number;
  dominantEmotionLabel: string;
  diaryCountDelta: number;
}

export interface StatisticsEmotion {
  id: string;
  label: string;
  image: string;
  count: number;
  percentage: number;
}

export interface StatisticsTrendPoint {
  date: string;
  dayLabel: string;
  moodScore: number | null;
  diaryCount: number;
}

export interface StatisticsWeekdayPoint {
  weekday: string;
  total: number;
  [emotionId: string]: string | number;
}

export interface StatisticsTagRelation {
  tagId: string;
  tagName: string;
  count: number;
  topEmotionLabel: string;
  topEmotionImage: string;
}

export interface EmotionStatisticsData {
  monthDate: string;
  monthLabel: string;
  summary: StatisticsSummary;
  emotions: StatisticsEmotion[];
  trend: StatisticsTrendPoint[];
  weekdayPattern: StatisticsWeekdayPoint[];
  tagRelations: StatisticsTagRelation[];
}

interface StatisticsDiaryRow {
  id: string;
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

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const EMOTION_SCORE: Record<string, number> = {
  happy: 88,
  joyful: 92,
  grinning: 82,
  calm: 74,
  excited: 86,
  confused: 48,
  anxious: 38,
  scared: 34,
  sad: 32,
  disappointed: 30,
  angry: 28,
};

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

function getEmotionImage(id: string, image?: string | null) {
  return image ?? `/image/emotions/${id}.svg`;
}

function getMoodScore(emotionId: string) {
  return EMOTION_SCORE[emotionId] ?? 55;
}

function getEmptyData(monthDate: string, monthLabel: string): EmotionStatisticsData {
  return {
    monthDate,
    monthLabel,
    summary: {
      diaryCount: 0,
      activeDayCount: 0,
      dominantEmotionLabel: "아직 없음",
      diaryCountDelta: 0,
    },
    emotions: [],
    trend: [],
    weekdayPattern: WEEKDAYS.map((weekday) => ({ weekday, total: 0 })),
    tagRelations: [],
  };
}

export async function getEmotionStatisticsData({
  year,
  month,
}: {
  year?: string;
  month?: string;
}): Promise<EmotionStatisticsData> {
  const validMonth = getValidMonth(year, month);
  const startOfMonth = new Date(validMonth.year, validMonth.month - 1, 1);
  const startOfNextMonth = new Date(validMonth.year, validMonth.month, 1);
  const startOfPrevMonth = new Date(validMonth.year, validMonth.month - 2, 1);
  const monthDate = getLocalDateKey(startOfMonth);
  const monthLabel = `${validMonth.year}년 ${validMonth.month}월 감정 통계`;
  const emptyData = getEmptyData(monthDate, monthLabel);

  const user = await getUser();
  if (!user) return emptyData;

  const supabase = await createClient();
  const { data: currentData, error } = await supabase
    .from("diaries")
    .select(
      `
      id,
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
    .order("created_at", { ascending: true })
    .returns<StatisticsDiaryRow[]>();

  if (error) {
    console.error("감정 통계 조회 오류:", error);
    return emptyData;
  }

  const { count: prevMonthCount } = await supabase
    .from("diaries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .gte("created_at", startOfPrevMonth.toISOString())
    .lt("created_at", startOfMonth.toISOString());

  const diaries = currentData ?? [];
  const emotionCounts = new Map<string, StatisticsEmotion>();
  const dateMap = new Map<string, { scores: number[]; count: number }>();
  const weekdayMap = new Map<string, StatisticsWeekdayPoint>(
    WEEKDAYS.map((weekday) => [weekday, { weekday, total: 0 }])
  );
  const tagMap = new Map<
    string,
    {
      tagId: string;
      tagName: string;
      count: number;
      emotions: Map<string, { label: string; image: string; count: number }>;
    }
  >();

  for (const diary of diaries) {
    if (!diary.created_at) continue;

    const createdAt = new Date(diary.created_at);
    const dateKey = getLocalDateKey(createdAt);
    const weekday = WEEKDAYS[createdAt.getDay()];
    const dayBucket = dateMap.get(dateKey) ?? { scores: [], count: 0 };
    const weekdayBucket = weekdayMap.get(weekday) ?? { weekday, total: 0 };
    const emotions = (diary.diary_emotions ?? [])
      .map((row) => row.emotions)
      .filter(
        (emotion): emotion is { id: string; label: string; image: string | null } =>
          Boolean(emotion)
      );

    dayBucket.count += 1;
    weekdayBucket.total = Number(weekdayBucket.total) + 1;

    for (const emotion of emotions) {
      const current = emotionCounts.get(emotion.id);
      emotionCounts.set(emotion.id, {
        id: emotion.id,
        label: emotion.label,
        image: getEmotionImage(emotion.id, emotion.image),
        count: (current?.count ?? 0) + 1,
        percentage: 0,
      });

      dayBucket.scores.push(getMoodScore(emotion.id));
      weekdayBucket[emotion.id] = Number(weekdayBucket[emotion.id] ?? 0) + 1;
    }

    dateMap.set(dateKey, dayBucket);
    weekdayMap.set(weekday, weekdayBucket);

    for (const tagRow of diary.diary_tags ?? []) {
      const tag = tagRow.tags;
      if (!tag) continue;

      const tagBucket =
        tagMap.get(tag.id) ??
        {
          tagId: tag.id,
          tagName: tag.name,
          count: 0,
          emotions: new Map<string, { label: string; image: string; count: number }>(),
        };

      tagBucket.count += 1;

      for (const emotion of emotions) {
        const current = tagBucket.emotions.get(emotion.id);
        tagBucket.emotions.set(emotion.id, {
          label: emotion.label,
          image: getEmotionImage(emotion.id, emotion.image),
          count: (current?.count ?? 0) + 1,
        });
      }

      tagMap.set(tag.id, tagBucket);
    }
  }

  const totalEmotionCount = Array.from(emotionCounts.values()).reduce(
    (sum, emotion) => sum + emotion.count,
    0
  );
  const emotions = Array.from(emotionCounts.values())
    .map((emotion) => ({
      ...emotion,
      percentage:
        totalEmotionCount === 0
          ? 0
          : Math.round((emotion.count / totalEmotionCount) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const daysInMonth = new Date(validMonth.year, validMonth.month, 0).getDate();
  const trend = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(validMonth.year, validMonth.month - 1, index + 1);
    const dateKey = getLocalDateKey(date);
    const dayBucket = dateMap.get(dateKey);
    const moodScore =
      dayBucket && dayBucket.scores.length > 0
        ? Math.round(
            dayBucket.scores.reduce((sum, score) => sum + score, 0) /
              dayBucket.scores.length
          )
        : null;

    return {
      date: dateKey,
      dayLabel: `${index + 1}일`,
      moodScore,
      diaryCount: dayBucket?.count ?? 0,
    };
  });

  const tagRelations = Array.from(tagMap.values())
    .map((tag) => {
      const topEmotion = Array.from(tag.emotions.values()).sort(
        (a, b) => b.count - a.count
      )[0];

      return {
        tagId: tag.tagId,
        tagName: tag.tagName,
        count: tag.count,
        topEmotionLabel: topEmotion?.label ?? "감정 없음",
        topEmotionImage: topEmotion?.image ?? "/image/emotions/calm.svg",
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    monthDate,
    monthLabel,
    summary: {
      diaryCount: diaries.length,
      activeDayCount: new Set(Array.from(dateMap.keys())).size,
      dominantEmotionLabel: emotions[0]?.label ?? "아직 없음",
      diaryCountDelta: diaries.length - (prevMonthCount ?? 0),
    },
    emotions,
    trend,
    weekdayPattern: WEEKDAYS.map((weekday) => weekdayMap.get(weekday) ?? { weekday, total: 0 }),
    tagRelations,
  };
}
