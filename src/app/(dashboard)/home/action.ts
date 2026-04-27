"use server";

import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";

export interface HomeEmotionStat {
  id: string;
  label: string;
  image: string;
  count: number;
  percentage: number;
}

export interface HomeCalendarEntry {
  date: string;
  emotionId: string;
  emotionLabel: string;
  emotionImage: string;
  count: number;
}

export interface HomeRecentDiary {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  emotion: {
    id: string;
    label: string;
    image: string;
  } | null;
}

export interface HomePopularDiary {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  profileImage: string | null;
  emotion: { type: string; label: string } | null;
  likes: number;
  comments: number;
  images: string[];
}

export interface HomeDashboardData {
  monthLabel: string;
  emotionStats: HomeEmotionStat[];
  calendarEntries: HomeCalendarEntry[];
  recentDiaries: HomeRecentDiary[];
  popularDiaries: HomePopularDiary[];
}

interface DiaryEmotionRow {
  emotion_id: string;
  emotions: {
    id: string;
    label: string;
    image: string | null;
  } | null;
}

interface DiaryRow {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  diary_emotions: DiaryEmotionRow[] | null;
}

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthLabel = `${now.getMonth() + 1}월의 감정 기록`;

  const emptyData: HomeDashboardData = {
    monthLabel,
    emotionStats: [],
    calendarEntries: [],
    recentDiaries: [],
    popularDiaries: [],
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
    .returns<DiaryRow[]>();

  if (error) {
    console.error("홈 데이터 조회 오류:", error);
    return emptyData;
  }

  const diaries = data ?? [];
  const emotionCounts = new Map<string, HomeEmotionStat>();
  const calendarMap = new Map<string, HomeCalendarEntry>();

  for (const diary of diaries) {
    const createdAt = diary.created_at ? new Date(diary.created_at) : null;
    const emotions = diary.diary_emotions ?? [];

    for (const item of emotions) {
      const emotion = item.emotions;
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

    const firstEmotion = emotions[0]?.emotions;
    if (createdAt && firstEmotion) {
      const dateKey = toDateKey(createdAt);
      const current = calendarMap.get(dateKey);
      calendarMap.set(dateKey, {
        date: dateKey,
        emotionId: current?.emotionId ?? firstEmotion.id,
        emotionLabel: current?.emotionLabel ?? firstEmotion.label,
        emotionImage:
          current?.emotionImage ??
          firstEmotion.image ??
          `/image/emotions/${firstEmotion.id}.svg`,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  const totalEmotionCount = Array.from(emotionCounts.values()).reduce(
    (sum, item) => sum + item.count,
    0
  );

  const emotionStats = Array.from(emotionCounts.values())
    .map((item) => ({
      ...item,
      percentage:
        totalEmotionCount === 0
          ? 0
          : Math.round((item.count / totalEmotionCount) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentDiaries = diaries.slice(0, 3).map((diary) => {
    const emotion = diary.diary_emotions?.[0]?.emotions ?? null;
    return {
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ?? new Date().toISOString(),
      emotion: emotion
        ? {
            id: emotion.id,
            label: emotion.label,
            image: emotion.image ?? `/image/emotions/${emotion.id}.svg`,
          }
        : null,
    };
  });

  // 이번 주 인기 일기 TOP3 (공개 일기 중 공감 수 기준)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const { data: popularData } = await supabase
    .from("diaries")
    .select(
      `
      id,
      title,
      content,
      created_at,
      profiles (
        nickname,
        profile_image
      ),
      diary_emotions (
        emotion_id,
        emotions (
          id,
          label
        )
      ),
      diary_images (
        image_url,
        sort_order
      ),
      diary_likes (id),
      comments (id, deleted_at)
      `
    )
    .eq("is_private", false)
    .is("deleted_at", null)
    .gte("created_at", oneWeekAgo.toISOString())
    .returns<{
      id: string;
      title: string;
      content: string;
      created_at: string | null;
      profiles: { nickname: string; profile_image: string | null } | null;
      diary_emotions: { emotion_id: string; emotions: { id: string; label: string } | null }[] | null;
      diary_images: { image_url: string; sort_order: number }[] | null;
      diary_likes: { id: string }[] | null;
      comments: { id: string; deleted_at: string | null }[] | null;
    }[]>();

  const popularDiaries: HomePopularDiary[] = (popularData ?? [])
    .sort((a, b) => (b.diary_likes?.length ?? 0) - (a.diary_likes?.length ?? 0))
    .slice(0, 3)
    .map((diary) => {
      const firstEmotion = diary.diary_emotions?.[0]?.emotions ?? null;
      const sortedImages = (diary.diary_images ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => img.image_url);
      return {
        id: diary.id,
        title: diary.title,
        content: diary.content,
        createdAt: diary.created_at ?? new Date().toISOString(),
        authorName: diary.profiles?.nickname ?? "익명",
        profileImage: diary.profiles?.profile_image ?? null,
        emotion: firstEmotion ? { type: firstEmotion.id, label: firstEmotion.label } : null,
        likes: diary.diary_likes?.length ?? 0,
        comments: diary.comments?.filter((c) => c.deleted_at === null).length ?? 0,
        images: sortedImages,
      };
    });

  return {
    monthLabel,
    emotionStats,
    calendarEntries: Array.from(calendarMap.values()),
    recentDiaries,
    popularDiaries,
  };
}
