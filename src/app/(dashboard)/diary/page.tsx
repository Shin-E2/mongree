"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { HeaderStandardMFull } from "@/commons/components/header";
import { useInfiniteScroll } from "@/commons/hooks/use-infinite-scroll";
import { getDiaries } from "./action";
import type { Diary } from "./types";
import { DiaryListEmotionFilter } from "@/components/home/(dashboard)/diary/list/emotion-filter";
import { DiaryListDiaryCard } from "@/components/home/(dashboard)/diary/list/diary-card";

export default function DiaryListPage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  // 데이터 로드 함수
  const loadDiaries = useCallback(
    async (pageNum: number, isNewSearch = false) => {
      setIsLoading(true);
      try {
        const result = await getDiaries({
          page: pageNum,
          searchTerm,
          emotions: selectedEmotions,
          dateRange,
        });

        if (result.success) {
          if (isNewSearch) {
            setDiaries(result.diaries);
          } else {
            setDiaries((prev) => [...prev, ...result.diaries]);
          }
          setHasMore(result.hasMore);
        }
      } catch (error) {
        console.error("Failed to load diaries:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, selectedEmotions, dateRange]
  );

  // 무한 스크롤
  const loadMoreDiaries = useCallback(async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await loadDiaries(nextPage);
    }
  }, [isLoading, hasMore, page, loadDiaries]);

  const observerRef = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMoreDiaries,
  });

  // 검색어 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        setPage(1);
        loadDiaries(1, true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, loadDiaries]);

  // 감정 필터 변경
  const handleEmotionToggle = useCallback(
    (emotionId: string) => {
      setSelectedEmotions((prev) =>
        prev.includes(emotionId)
          ? prev.filter((id) => id !== emotionId)
          : [...prev, emotionId]
      );
      setPage(1);
      loadDiaries(1, true);
    },
    [loadDiaries]
  );

  // 초기 데이터 로드
  useEffect(() => {
    loadDiaries(1, true);
  }, [loadDiaries]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderStandardMFull
        title="나의 일기장"
        description="오늘의 감정을 기록하세요"
      />

      <div className="flex flex-col gap-6 px-4 py-6 md:mx-32">
        {/* 검색 및 필터 영역 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="일기 검색..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
          </div>
          <DiaryListEmotionFilter
            selectedEmotions={selectedEmotions}
            onToggle={handleEmotionToggle}
          />
        </div>

        {/* 일기 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {diaries.map((diary) => (
            <DiaryListDiaryCard
              key={diary.id}
              diary={diary}
              onClick={() => router.push(`/diary/${diary.id}`)}
            />
          ))}
        </div>

        {/* 무한 스크롤 */}
        <div
          ref={observerRef}
          className="h-16 flex items-center justify-center"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          )}
        </div>
      </div>
    </div>
  );
}
