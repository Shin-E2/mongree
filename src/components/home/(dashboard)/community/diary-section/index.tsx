"use client";

import { useEffect, useState, useTransition } from "react";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
import type {
  CommunityLoginUser,
  PublicDiary,
} from "@/app/(dashboard)/community/types";
import CommunityDiaryList from "../diary-list";
import { FilterDropdown } from "@/commons/components/filter-dropdown";
import { ArrowDownWideNarrow, ChevronDown } from "lucide-react";
import { getPublicDiaries } from "@/app/(dashboard)/community/action";
import styles from "./styles.module.css";

export default function CommunityDiarySection({
  initialDiaries,
  loginUser,
}: {
  initialDiaries: PublicDiary[];
  loginUser: CommunityLoginUser;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [diaries, setDiaries] = useState(initialDiaries);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getPublicDiaries({
        page: 1,
        searchTerm,
        emotions: selectedEmotions,
        sortBy,
      });

      if (!result.success) {
        setErrorMessage(
          result.error ?? "공개 일기를 불러오는 중 문제가 발생했습니다."
        );
        setDiaries([]);
        return;
      }

      setErrorMessage("");
      setDiaries(result.diaries);
    });
  }, [searchTerm, selectedEmotions, sortBy]);

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
            <button className={styles.filterButton} type="button" aria-label="정렬 선택">
              <ArrowDownWideNarrow className={styles.sortIcon} />
              <span className={styles.filterText}>
                {sortBy === "latest" ? "최신순" : "인기순"}
              </span>
              <ChevronDown className={styles.chevronIcon} />
            </button>
          }
          content={
            <div className={styles.dropdownContent}>
              <button
                className={styles.dropdownButton}
                onClick={() => setSortBy("latest")}
                type="button"
              >
                최신순
              </button>
              <button
                className={styles.dropdownButton}
                onClick={() => setSortBy("popular")}
                type="button"
              >
                인기순
              </button>
            </div>
          }
          className={styles.filterDropdownWrapper}
          panelClassName={styles.sortPanel}
        />
      </div>
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
      {isPending && <p className={styles.loadingText}>불러오는 중...</p>}
      <CommunityDiaryList diaries={diaries} loginUser={loginUser} />
    </>
  );
}