import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  NotebookPen,
  TrendingUp,
} from "lucide-react";
import { HeaderStandardMFull } from "@/commons/components/header";
import { URL } from "@/commons/constants/global-url";
import StatisticsCharts from "./charts";
import { getEmotionStatisticsData } from "./action";
import styles from "./styles.module.css";

interface StatisticsPageProps {
  searchParams?: Promise<{
    year?: string;
    month?: string;
  }>;
}

function getAdjacentMonth(monthDate: string, direction: -1 | 1) {
  const date = new Date(monthDate);
  return new Date(date.getFullYear(), date.getMonth() + direction, 1);
}

function getMonthLink(date: Date) {
  return `/statistics?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
}

function getDeltaText(delta: number) {
  if (delta > 0) return `지난달보다 ${delta}편 더 기록`;
  if (delta < 0) return `지난달보다 ${Math.abs(delta)}편 적게 기록`;
  return "지난달과 같은 기록 수";
}

export default async function StatisticsPage({ searchParams }: StatisticsPageProps) {
  const params = await searchParams;
  const statisticsData = await getEmotionStatisticsData({
    year: params?.year,
    month: params?.month,
  });
  const prevMonth = getAdjacentMonth(statisticsData.monthDate, -1);
  const nextMonth = getAdjacentMonth(statisticsData.monthDate, 1);
  const dominantEmotion = statisticsData.emotions[0];

  return (
    <div className={styles.pageContainer}>
      <HeaderStandardMFull
        title="감정 통계"
        description="숫자와 차트로 내 감정의 반복 패턴을 직접 찾아보세요."
      />

      <div className={styles.contentWrapper}>
        <div className={styles.toolbar}>
          <Link
            href={getMonthLink(prevMonth)}
            className={styles.navButton}
            aria-label="이전 달"
          >
            <ChevronLeft className={styles.navIcon} />
          </Link>
          <div className={styles.monthTitle}>{statisticsData.monthLabel}</div>
          <Link
            href={getMonthLink(nextMonth)}
            className={styles.navButton}
            aria-label="다음 달"
          >
            <ChevronRight className={styles.navIcon} />
          </Link>
        </div>

        <section className={styles.heroSection}>
          <div className={styles.heroText}>
            <span className={styles.badge}>
              <TrendingUp className={styles.badgeIcon} />
              감정 패턴 관찰
            </span>
            <h2 className={styles.heroTitle}>
              {dominantEmotion
                ? `이번 달은 ${dominantEmotion.label} 감정이 가장 자주 나타났어요`
                : "이번 달 감정 통계를 기다리고 있어요"}
            </h2>
            <p className={styles.heroDescription}>
              AI 리포트가 감정을 해석한다면, 감정 통계는 사용자가 직접 흐름을 발견하는 공간입니다.
              요일, 태그, 날짜별 변화를 비교하며 나만의 반복 패턴을 확인해보세요.
            </p>
          </div>

          <div className={styles.heroEmotionCard}>
            {dominantEmotion ? (
              <>
                <Image
                  src={dominantEmotion.image}
                  alt={dominantEmotion.label}
                  width={70}
                  height={70}
                  className={styles.heroEmotionImage}
                />
                <div>
                  <p className={styles.heroEmotionLabel}>{dominantEmotion.label}</p>
                  <p className={styles.heroEmotionDescription}>
                    전체 감정 기록 중 {dominantEmotion.percentage}%를 차지했어요.
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.emptyHeroEmotion}>
                일기를 작성하면 대표 감정이 표시됩니다.
              </div>
            )}
          </div>
        </section>

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <NotebookPen className={styles.summaryIcon} />
            <span className={styles.summaryValue}>
              {statisticsData.summary.diaryCount}
            </span>
            <span className={styles.summaryLabel}>작성한 일기</span>
            <span className={styles.summaryHint}>
              {getDeltaText(statisticsData.summary.diaryCountDelta)}
            </span>
          </article>
          <article className={styles.summaryCard}>
            <CalendarDays className={styles.summaryIcon} />
            <span className={styles.summaryValue}>
              {statisticsData.summary.activeDayCount}
            </span>
            <span className={styles.summaryLabel}>기록한 날짜</span>
            <span className={styles.summaryHint}>월 안에서 감정이 남은 날</span>
          </article>
          <article className={styles.summaryCard}>
            <HeartPulse className={styles.summaryIcon} />
            <span className={styles.summaryValue}>
              {statisticsData.summary.dominantEmotionLabel}
            </span>
            <span className={styles.summaryLabel}>대표 감정</span>
            <span className={styles.summaryHint}>이번 달 가장 자주 선택</span>
          </article>
        </section>

        <div className={styles.chartGrid}>
          <StatisticsCharts
            emotions={statisticsData.emotions}
            trend={statisticsData.trend}
            weekdayPattern={statisticsData.weekdayPattern}
          />
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>태그로 보는 감정 단서</h2>
              <p className={styles.panelDescription}>
                자주 쓴 태그와 함께 나타난 대표 감정을 묶어서 보여줍니다.
              </p>
            </div>
          </div>

          {statisticsData.tagRelations.length > 0 ? (
            <div className={styles.tagGrid}>
              {statisticsData.tagRelations.map((tag) => (
                <article key={tag.tagId} className={styles.tagCard}>
                  <div className={styles.tagHeader}>
                    <span className={styles.tagName}>#{tag.tagName}</span>
                    <span className={styles.tagCount}>{tag.count}회</span>
                  </div>
                  <div className={styles.tagEmotion}>
                    <Image
                      src={tag.topEmotionImage}
                      alt={tag.topEmotionLabel}
                      width={28}
                      height={28}
                      className={styles.tagEmotionImage}
                    />
                    <span>{tag.topEmotionLabel}과 자주 연결</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>아직 태그 통계가 없습니다</p>
              <p className={styles.emptyDescription}>
                일기에 태그를 남기면 감정이 반복되는 상황을 더 쉽게 찾을 수 있습니다.
              </p>
              <Link href={URL().DIARY_NEW} className={styles.writeLink}>
                일기 작성
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
