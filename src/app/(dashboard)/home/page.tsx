import HomeAIAnalysis from "@/components/home/(sidebar)/ai-analysis";
import HomeEmotionStats from "@/components/home/(sidebar)/emotion-stats";
import HomeEmotionalCalendar from "@/components/home/(sidebar)/emotional-calendar";
import HomePopularDiaryCard from "@/components/home/(sidebar)/popular-diary-card";
import HomeRecentDiary from "@/components/home/(sidebar)/recent-diary";
import Image from "next/image";
import Link from "next/link";
import { getHomeDashboardData } from "./action";
import styles from "./styles.module.css";

export default async function HomePage() {
  const dashboardData = await getHomeDashboardData();
  const primaryEmotion = dashboardData.emotionStats[0];
  const diaryCount = dashboardData.recentDiaries.length;

  return (
    <div className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <span className={styles.heroEyebrow}>오늘의 감정 날씨</span>
          <h1 className={styles.heroTitle}>감정을 하늘에 살짝 붙여둘 시간</h1>
          <p className={styles.heroDescription}>
            길게 쓰지 않아도 괜찮아요. 지금 떠오르는 감정 하나와 짧은 문장만
            남겨도 이번 달의 흐름이 조금씩 보여요.
          </p>
          <div className={styles.heroActions}>
            <Link href="/diary/new" className={styles.primaryAction}>
              오늘 일기 쓰기
            </Link>
            <Link href="/ai-report" className={styles.secondaryAction}>
              리포트 보기
            </Link>
          </div>
        </div>
        <div className={styles.heroWidget}>
          <div className={styles.skyOrb} aria-hidden="true">
            {primaryEmotion ? (
              <Image
                src={primaryEmotion.image}
                alt=""
                width={80}
                height={80}
                className={styles.skyOrbImage}
                priority
              />
            ) : (
              <span className={styles.skyFace}>•ᴗ•</span>
            )}
          </div>
          <div className={styles.heroMetricRow}>
            <div>
              <span className={styles.metricLabel}>이번 달 대표 감정</span>
              <strong className={styles.metricValue}>
                {primaryEmotion?.label ?? "아직 없어요"}
              </strong>
            </div>
            <div>
              <span className={styles.metricLabel}>최근 기록</span>
              <strong className={styles.metricValue}>{diaryCount}개</strong>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.gridContainer}>
        {/* 감정 캘린더 */}
        <div className={styles.calendarColumn}>
          <HomeEmotionalCalendar
            monthLabel={dashboardData.monthLabel}
            monthDate={dashboardData.monthDate}
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
