"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { EMOTIONS } from "@/mock/emotions";
import { FilterDropdown } from "@/commons/components/filter-dropdown";
import EmotionFilterItem from "@/commons/components/emotion-filter-item";
import styles from "./styles.module.css";

interface IDiaryListEmotionFilterProps {
  selectedEmotions: string[];
  onToggle: (id: string) => void;
}

export function DiaryListEmotionFilter({
  selectedEmotions,
  onToggle,
}: IDiaryListEmotionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FilterDropdown
      trigger={
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.triggerButton}
        >
          <span className={styles.triggerTextWrapper}>
            {selectedEmotions.length === 0 ? (
              <>
                <Filter className={styles.filterIcon} />
                <span className={styles.filterText}>감정 필터</span>
              </>
            ) : (
              <span className={styles.selectedCountText}>
                {selectedEmotions.length}개 선택
              </span>
            )}
          </span>
          <ChevronDown
            className={`${styles.chevronIcon} ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      }
      content={
        <div className={styles.contentGrid}>
          {EMOTIONS.map((emotion) => (
            <EmotionFilterItem
              key={emotion.id}
              emotion={emotion}
              onClick={(id) => {
                onToggle(id);
                setIsOpen(false);
              }}
              isSelected={selectedEmotions.includes(emotion.id)}
            />
          ))}
        </div>
      }
    />
  );
}
