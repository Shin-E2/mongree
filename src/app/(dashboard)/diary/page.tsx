"use client";

import { HeaderStandardMFull } from "@/commons/components/header";
import useDiaryList from "./hook";
import DiaryListDiarySection from "@/components/home/(dashboard)/diary/list/diary-section";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
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
      <HeaderStandardMFull
        title="나의 일기장"
        description="오늘의 감정을 기록하세요"
      />

      <div className={styles.contentWrapper}>
        {/* 검색 및 필터 영역 */}
        <DiaryListSearchFilter
          setSearchTerm={setSearchTerm}
          selectedEmotions={selectedEmotions}
          handleEmotionToggle={handleEmotionToggle}
        />

        {/* 일기 목록*/}
        <DiaryListDiarySection diaries={diaries} router={router} />

        {/* 무한 스크롤 */}
        <div ref={observerRef} className={styles.observerDiv}>
          {isLoading && <div className={styles.loadingSpinner} />}
        </div>
      </div>
    </div>
  );
}
