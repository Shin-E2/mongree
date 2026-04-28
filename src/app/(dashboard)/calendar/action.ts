"use server";

import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import type { EmotionCalendarEntry } from "@/commons/components/emotion-calendar/types";

export interface CalendarDiaryItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  emotions: {
    id: string;
    label: string;
    image: string;
  }[];
}

export interface EmotionCalendarData {
  monthLabel: string;
  monthDate: string;
  entries: EmotionCalendarEntry[];
  selectedDate: string;
  selectedDiaries: CalendarDiaryItem[];
}

interface CalendarDiaryRow {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  is_private: boolean | null;
  diary_emotions:
    | {
        emotion_id: string;
        emotions: {
          id: string;
          label: string;
          image: string | null;
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

function getPrimaryEmotion(
  rows: NonNullable<CalendarDiaryRow["diary_emotions"]>
) {
  return rows.find((row) => row.emotions)?.emotions ?? null;
}

export async function getEmotionCalendarData({
  year,
  month,
  selectedDate,
}: {
  year?: string;
  month?: string;
  selectedDate?: string;
}): Promise<EmotionCalendarData> {
  const validMonth = getValidMonth(year, month);
  const startOfMonth = new Date(validMonth.year, validMonth.month - 1, 1);
  const startOfNextMonth = new Date(validMonth.year, validMonth.month, 1);
  const monthDate = getLocalDateKey(startOfMonth);
  const monthLabel = `${validMonth.month}월의 감정 기록`;
  const todayKey = getLocalDateKey(new Date());
  const isCurrentMonth =
    todayKey.slice(0, 7) === monthDate.slice(0, 7);
  const fallbackSelectedDate = selectedDate ?? (isCurrentMonth ? todayKey : monthDate);

  const emptyData: EmotionCalendarData = {
    monthLabel,
    monthDate,
    entries: [],
    selectedDate: fallbackSelectedDate,
    selectedDiaries: [],
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
      is_private,
      diary_emotions (
        emotion_id,
        emotions (
          id,
          label,
          image
        )
      )
      `
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .gte("created_at", startOfMonth.toISOString())
    .lt("created_at", startOfNextMonth.toISOString())
    .order("created_at", { ascending: false })
    .returns<CalendarDiaryRow[]>();

  if (error) {
    console.error("감정 캘린더 조회 오류:", error);
    return emptyData;
  }

  const diaries = data ?? [];
  const calendarMap = new Map<string, EmotionCalendarEntry>();

  for (const diary of diaries) {
    const createdAt = diary.created_at ? new Date(diary.created_at) : null;
    const emotions = diary.diary_emotions ?? [];
    const primaryEmotion = getPrimaryEmotion(emotions);

    if (!createdAt || !primaryEmotion) continue;

    const dateKey = getLocalDateKey(createdAt);
    const current = calendarMap.get(dateKey);

    calendarMap.set(dateKey, {
      date: dateKey,
      count: (current?.count ?? 0) + 1,
      emotion: current?.emotion ?? {
        id: primaryEmotion.id,
        label: primaryEmotion.label,
        image: primaryEmotion.image ?? `/image/emotions/${primaryEmotion.id}.svg`,
      },
    });
  }

  const selectedDiaries = diaries
    .filter((diary) => {
      if (!diary.created_at) return false;
      return getLocalDateKey(new Date(diary.created_at)) === fallbackSelectedDate;
    })
    .map((diary) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ?? new Date().toISOString(),
      isPrivate: diary.is_private ?? false,
      emotions:
        diary.diary_emotions
          ?.map((row) => row.emotions)
          .filter(
            (
              emotion
            ): emotion is { id: string; label: string; image: string | null } =>
              Boolean(emotion)
          )
          .map((emotion) => ({
            id: emotion.id,
            label: emotion.label,
            image: emotion.image ?? `/image/emotions/${emotion.id}.svg`,
          })) ?? [],
    }));

  return {
    monthLabel,
    monthDate,
    entries: Array.from(calendarMap.values()),
    selectedDate: fallbackSelectedDate,
    selectedDiaries,
  };
}
