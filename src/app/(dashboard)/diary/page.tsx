"use client";

import { HeaderStandardMFull } from "@/commons/components/header";
import useDiaryList from "./hook";
import DiaryListDiarySection from "@/components/home/(dashboard)/diary/list/diary-section";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";

export default function DiaryListPage() {
  const { observerRef, isLoading } = useDiaryList();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderStandardMFull
        title="나의 일기장"
        description="오늘의 감정을 기록하세요"
      />

      <div className="flex flex-col gap-6 px-4 py-6 md:mx-32">
        {/* 검색 및 필터 영역 */}
        <DiaryListSearchFilter />

        {/* 일기 목록 */}
        <DiaryListDiarySection />

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
