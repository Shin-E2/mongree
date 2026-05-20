import Image from "next/image";
import Link from "next/link";
import {
  BrainCircuit,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
  Sparkles,
} from "lucide-react";
import { URL } from "@/commons/constants/global-url";
import { formatToTimeAgo } from "@/lib/utils";
import { getAiEmotionReportData } from "./action";
import { GenerateReportButton } from "./generate-report-button";
import { ReportActions } from "./report-actions";
import styles from "./styles.module.css";

interface AiReportPageProps {
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
  return `/ai-report?year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
}

export default async function AiReportPage({ searchParams }: AiReportPageProps) {
  const params = await searchParams;
  const reportData = await getAiEmotionReportData({
    year: params?.year,
    month: params?.month,
  });
  const currentMonth = new Date(reportData.monthDate);
  const prevMonth = getAdjacentMonth(reportData.monthDate, -1);
  const nextMonth = getAdjacentMonth(reportData.monthDate, 1);
  const dominantEmotion = reportData.emotionStats[0];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.toolbar}>
          <Link
            href={getMonthLink(prevMonth)}
            className={styles.navButton}
            aria-label="이전 달"
          >
            <ChevronLeft className={styles.navIcon} />
          </Link>
          <div className={styles.monthTitle}>{reportData.monthLabel}</div>
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
              <Sparkles className={styles.badgeIcon} />
              데이터 기반 월간 리포트
            </span>
            <h2 className={styles.heroTitle}>
              {dominantEmotion
                ? `${currentMonth.getMonth() + 1}월에는 ${dominantEmotion.label}이 가장 많이 보였어요`
                : "이번 달 감정 흐름을 기다리고 있어요"}
            </h2>
            <p className={styles.heroDescription}>
              일기가 쌓일수록 감정의 반복, 기록 리듬, 자주 등장하는 단서를
              더 선명하게 읽어줍니다.
            </p>
          </div>
          <div className={styles.heroMetricGrid}>
            <div className={styles.metricCard}>
              <NotebookPen className={styles.metricIcon} />
              <span className={styles.metricValue}>{reportData.diaryCount}</span>
              <span className={styles.metricLabel}>작성한 일기</span>
            </div>
            <div className={styles.metricCard}>
              <CalendarDays className={styles.metricIcon} />
              <span className={styles.metricValue}>
                {reportData.activeDayCount}
              </span>
              <span className={styles.metricLabel}>기록한 날짜</span>
            </div>
            <div className={styles.metricCard}>
              <BrainCircuit className={styles.metricIcon} />
              <span className={styles.metricValue}>
                {reportData.longestStreak}
              </span>
              <span className={styles.metricLabel}>최장 연속 기록</span>
            </div>
          </div>
        </section>

        <section className={styles.generatedReportPanel}>
          <div className={styles.generatedReportBody}>
            <div className={styles.generatedReportHeader}>
              <span className={styles.generatedReportBadge}>
                {reportData.generatedReport.source === "openai"
                  ? "OpenAI 생성 리포트"
                  : "로컬 안전 리포트"}
              </span>
              <h3 className={styles.generatedReportTitle}>
                {reportData.generatedReport.summary}
              </h3>
              <p className={styles.generatedReportDescription}>
                {reportData.generatedReport.gentleInsight}
              </p>
              <p className={styles.privacyNote}>
                공유와 내보내기는 원문 제외 요약만 사용합니다.
              </p>
              <div className={styles.reportControlRow}>
                <GenerateReportButton
                  month={reportData.reportStatus.month}
                  hasSavedReport={reportData.reportStatus.saved}
                />
                {reportData.reportStatus.saved && (
                  <ReportActions
                    month={reportData.reportStatus.month}
                    monthLabel={reportData.monthLabel}
                    report={reportData.generatedReport}
                  />
                )}
              </div>
            </div>

            {reportData.generatedReport.dominantEmotions.length > 0 && (
              <div className={styles.generatedEmotionList}>
                {reportData.generatedReport.dominantEmotions.map((emotion) => (
                  <span key={emotion} className={styles.generatedEmotion}>
                    {emotion}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.recommendationList}>
              {reportData.generatedReport.recommendations.map((recommendation) => (
                <p key={recommendation} className={styles.recommendationItem}>
                  {recommendation}
                </p>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.reportGrid}>
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>감정 분포</h3>
            {reportData.emotionStats.length > 0 ? (
              <div className={styles.emotionList}>
                {reportData.emotionStats.map((emotion) => (
                  <div key={emotion.id} className={styles.emotionItem}>
                    <div className={styles.emotionInfo}>
                      <Image
                        src={emotion.image}
                        alt={emotion.label}
                        width={28}
                        height={28}
                        className={styles.emotionImage}
                      />
                      <span className={styles.emotionLabel}>
                        {emotion.label}
                      </span>
                    </div>
                    <div className={styles.progressWrapper}>
                      <div
                        className={styles.progressBar}
                        style={{ width: `${emotion.percentage}%` }}
                      />
                    </div>
                    <span className={styles.percentText}>
                      {emotion.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>
                감정을 선택한 일기가 생기면 분포가 표시됩니다.
              </p>
            )}
          </section>

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>AI가 읽은 단서</h3>
            <div className={styles.insightList}>
              {reportData.insights.map((insight) => (
                <article key={insight.title} className={styles.insightCard}>
                  <h4 className={styles.insightTitle}>{insight.title}</h4>
                  <p className={styles.insightDescription}>
                    {insight.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.bottomGrid}>
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>자주 쓴 태그</h3>
            {reportData.tagStats.length > 0 ? (
              <div className={styles.tagList}>
                {reportData.tagStats.map((tag) => (
                  <span key={tag.id} className={styles.tagItem}>
                    #{tag.name}
                    <span className={styles.tagCount}>{tag.count}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>
                태그를 남기면 반복되는 상황을 더 쉽게 묶어볼 수 있습니다.
              </p>
            )}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>최근 분석 대상 일기</h3>
              <Link href={URL().DIARY} className={styles.panelLink}>
                전체 보기
              </Link>
            </div>
            {reportData.recentDiaries.length > 0 ? (
              <div className={styles.diaryList}>
                {reportData.recentDiaries.map((diary) => (
                  <Link
                    key={diary.id}
                    href={URL().DIARY_DETAIL(diary.id)}
                    className={styles.diaryCard}
                  >
                    <h4 className={styles.diaryTitle}>{diary.title}</h4>
                    <p className={styles.diaryContent}>{diary.content}</p>
                    <time className={styles.diaryTime}>
                      {formatToTimeAgo(new Date(diary.createdAt).toISOString())}
                    </time>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>아직 분석할 일기가 없습니다</p>
                <Link href={URL().DIARY_NEW} className={styles.writeLink}>
                  일기 작성
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
