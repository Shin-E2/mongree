"use client";

import { Search } from "lucide-react";
import { DiaryListEmotionFilter } from "../emotion-filter";
import useDiaryList from "@/app/(dashboard)/diary/hook";
import { SearchBarInput } from "@/commons/components/input";

export default function DiaryListSearchFilter() {
  const { setSearchTerm, selectedEmotions, handleEmotionToggle } =
    useDiaryList();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="relative w-full">
        <SearchBarInput
          placeholder="일기 검색..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
      </div>
      <DiaryListEmotionFilter
        selectedEmotions={selectedEmotions}
        onToggle={handleEmotionToggle}
      />
    </div>
  );
}
