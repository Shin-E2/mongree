"use client";

import { Search } from "lucide-react";
import { DiaryListEmotionFilter } from "../emotion-filter";
import { SearchBarInput } from "@/commons/components/input";
import { Dispatch, SetStateAction } from "react";
import styles from "./styles.module.css";

interface DiaryListSearchFilterProps {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedEmotions: string[];
  handleEmotionToggle: (id: string) => void;
}

export default function DiaryListSearchFilter({
  setSearchTerm,
  selectedEmotions,
  handleEmotionToggle,
}: DiaryListSearchFilterProps) {
  return (
    <div className={styles.container}>
      <div className={styles.searchBarWrapper}>
        <SearchBarInput
          placeholder="일기 검색..."
          onChange={(e) => setSearchTerm(e.target.value)}
          iconLeft={<Search className={styles.iconBase} />}
        />
      </div>
      <DiaryListEmotionFilter
        selectedEmotions={selectedEmotions}
        onToggle={handleEmotionToggle}
      />
    </div>
  );
}
