import { useInfiniteScroll } from "@/commons/hooks/use-infinite-scroll";
import { useCallback, useEffect, useState } from "react";
import { getDiaries } from "./action";
import { useRouter } from "next/navigation";
import type { Diary } from "./types";

export default function useDiaryList() {
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

  return {
    diaries,
    isLoading,
    observerRef,
    searchTerm,
    setSearchTerm,
    selectedEmotions,
    handleEmotionToggle,
    dateRange,
    setDateRange,
    router,
  };
}
