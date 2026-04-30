"use client";

import { HeaderStandardMFull } from "@/commons/components/header";
import { URL } from "@/commons/constants/global-url";
import DiaryListDiarySection from "@/components/home/(dashboard)/diary/list/diary-section";
import DiaryListSearchFilter from "@/components/home/(dashboard)/diary/list/search-filter";
import MongiCompanion from "@/components/home/(dashboard)/diary/mongi-companion";
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
      <HeaderStandardMFull
        title="나의 일기장"
        description="오늘의 감정을 기록하세요"
      />

      <div className={styles.contentWrapper}>
        <MongiCompanion onStartDiary={() => router.push(URL().DIARY_NEW)} />

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
