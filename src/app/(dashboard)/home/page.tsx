import HomeAIAnalysis from "@/components/home/(sidebar)/ai-analysis";
import HomeEmotionStats from "@/components/home/(sidebar)/emotion-stats";
import HomeEmotionalCalendar from "@/components/home/(sidebar)/emotional-calendar";
import HomePopularDiaryCard from "@/components/home/(sidebar)/popular-diary-card";
import HomeRecentDiary from "@/components/home/(sidebar)/recent-diary";
import { getHomeDashboardData } from "./action";
import styles from "./styles.module.css";

export default async function HomePage() {
  const dashboardData = await getHomeDashboardData();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridContainer}>
        {/* 감정 캘린더 */}
        <div className={styles.calendarColumn}>
          <HomeEmotionalCalendar
            monthLabel={dashboardData.monthLabel}
            entries={dashboardData.calendarEntries}
          />
        </div>

        {/* 이번달 감정 분포, ai감정분석 */}
        <div className={styles.sidebarColumn}>
          <HomeEmotionStats stats={dashboardData.emotionStats} />
          <HomeAIAnalysis />
        </div>

        <div className={styles.bottomSectionColumn}>
          {/* 주간 인기 일기 TOP3 */}
          <div className={styles.popularDiaryCardContainer}>
            <div className={styles.popularDiaryHeader}>
              <h2 className={styles.popularDiaryTitle}>
                이번 주 인기 일기 TOP 3
              </h2>
            </div>
            <div className={styles.popularDiaryGrid}>
              {dashboardData.popularDiaries.length > 0 ? (
                dashboardData.popularDiaries.map((diary) => (
                  <HomePopularDiaryCard key={diary.id} diary={diary} />
                ))
              ) : (
                <p className={styles.emptyPopularText}>
                  이번 주 공개된 인기 일기가 아직 없습니다.
                </p>
              )}
            </div>
          </div>
          <HomeRecentDiary diaries={dashboardData.recentDiaries} />
        </div>
      </div>
    </div>
  );
}
