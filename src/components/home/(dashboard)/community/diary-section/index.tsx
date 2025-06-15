"use client";

import { useState } from "react";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
import type { PublicDiary } from "@/app/(dashboard)/community/types";
import CommunityDiaryList from "../diary-list";
import { FilterDropdown } from "@/commons/components/filter-dropdown";
import { ChevronDown } from "lucide-react";
import styles from "./styles.module.css";

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
      <div className={styles.headerContainer}>
        <DiaryListSearchFilter
          setSearchTerm={setSearchTerm}
          selectedEmotions={selectedEmotions}
          handleEmotionToggle={handleEmotionToggle}
        />
        <FilterDropdown
          trigger={
            <button className={styles.filterButton}>
              {sortBy === "latest" ? "최신순" : "인기순"}
              <ChevronDown className={styles.chevronIcon} />
            </button>
          }
          content={
            <div className={styles.dropdownContent}>
              <button
                className={styles.dropdownButton}
                onClick={() => setSortBy("latest")}
              >
                최신순
              </button>
              <button
                className={styles.dropdownButton}
                onClick={() => setSortBy("popular")}
              >
                인기순
              </button>
            </div>
          }
          className={styles.filterDropdownWrapper}
        />
      </div>
      {/* 일기 리스트 */}
      <CommunityDiaryList diaries={diaries} />
    </>
  );
}
