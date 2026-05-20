"use client";

import DiaryListDiarySection from "@/components/home/(dashboard)/diary/list/diary-section";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
import useDiaryList from "./hook";
import styles from "./styles.module.css";

export default function DiaryListPage() {
  const {
    setSearchTerm,
    selectedEmotions,
    handleEmotionToggle,
    diaries,
    router,
    observerRef,
    isLoading,
  } = useDiaryList();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <DiaryListSearchFilter
          setSearchTerm={setSearchTerm}
          selectedEmotions={selectedEmotions}
          handleEmotionToggle={handleEmotionToggle}
        />

        <DiaryListDiarySection diaries={diaries} router={router} />

        <div ref={observerRef} className={styles.observerDiv}>
          {isLoading && <div className={styles.loadingSpinner} />}
        </div>
      </div>
    </div>
  );
}
