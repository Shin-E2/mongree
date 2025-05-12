"use client";

import { useState } from "react";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
import type { PublicDiary } from "@/app/(dashboard)/community/types";
import CommunityDiaryList from "../diary-list";

export default function CommunityDiarySection({
  initialDiaries,
}: {
  initialDiaries: PublicDiary[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");

  const diaries = initialDiaries;

  // 감정 필터
  const handleEmotionToggle = (id: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <DiaryListSearchFilter
          setSearchTerm={setSearchTerm}
          selectedEmotions={selectedEmotions}
          handleEmotionToggle={handleEmotionToggle}
        />
        <div className="relative w-40">
          <select
            className="pl-3 pr-6 py-2 rounded-lg border bg-white text-sm appearance-none focus:ring-2 focus:ring-indigo-600 w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </div>
      {/* 일기 리스트 */}
      <CommunityDiaryList diaries={diaries} />
    </>
  );
}
