"use client";

import DiaryListDiarySection from "@/components/home/(dashboard)/diary/list/diary-section";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
import useDiaryList from "./hook";
import styles from "./styles.module.css";
import type { Diary } from "./types";
import type { UserProfile } from "@/lib/get-user";

interface DiaryListClientProps {
  initialDiaries: Diary[];
  user: UserProfile | null;
}

export default function DiaryListClient({
  initialDiaries,
  user,
}: DiaryListClientProps) {
  const {
    setSearchTerm,
    selectedEmotions,
    handleEmotionToggle,
    diaries,
    router,
    observerRef,
    isLoading,
  } = useDiaryList(initialDiaries);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <DiaryListSearchFilter
          setSearchTerm={setSearchTerm}
          selectedEmotions={selectedEmotions}
          handleEmotionToggle={handleEmotionToggle}
        />

        <DiaryListDiarySection diaries={diaries} router={router} user={user} />

        <div ref={observerRef} className={styles.observerDiv}>
          {isLoading && <div className={styles.loadingSpinner} />}
        </div>
      </div>
    </div>
  );
}
