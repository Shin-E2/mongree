import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import EmotionCalendar from "@/commons/components/emotion-calendar";
import { HeaderStandardMFull } from "@/commons/components/header";
import { URL } from "@/commons/constants/global-url";
import { formatToTimeAgo } from "@/lib/utils";
import { getEmotionCalendarData } from "./action";
import styles from "./styles.module.css";

interface CalendarPageProps {
  searchParams?: Promise<{
    year?: string;
    month?: string;
    date?: string;
  }>;
}

function getMonthLink(year: number, month: number) {
  return `/calendar?year=${year}&month=${month}`;
}

function getAdjacentMonth(monthDate: string, direction: -1 | 1) {
  const date = new Date(monthDate);
  return new Date(date.getFullYear(), date.getMonth() + direction, 1);
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const params = await searchParams;
  const calendarData = await getEmotionCalendarData({
    year: params?.year,
    month: params?.month,
    selectedDate: params?.date,
  });

  const currentMonth = new Date(calendarData.monthDate);
  const prevMonth = getAdjacentMonth(calendarData.monthDate, -1);
  const nextMonth = getAdjacentMonth(calendarData.monthDate, 1);

  return (
    <div className={styles.pageContainer}>
      <HeaderStandardMFull
        title="감정 캘린더"
        description="날짜별로 남긴 일기와 감정 흐름을 한눈에 확인해보세요."
      />

      <div className={styles.contentWrapper}>
        <div className={styles.toolbar}>
          <Link
            href={getMonthLink(prevMonth.getFullYear(), prevMonth.getMonth() + 1)}
            className={styles.navButton}
            aria-label="이전 달"
          >
            <ChevronLeft className={styles.navIcon} />
          </Link>
          <div className={styles.monthTitle}>
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </div>
          <Link
            href={getMonthLink(nextMonth.getFullYear(), nextMonth.getMonth() + 1)}
            className={styles.navButton}
            aria-label="다음 달"
          >
            <ChevronRight className={styles.navIcon} />
          </Link>
        </div>

        <div className={styles.layoutGrid}>
          <EmotionCalendar
            monthLabel={calendarData.monthLabel}
            monthDate={calendarData.monthDate}
            entries={calendarData.entries}
            variant="full"
            selectedDate={calendarData.selectedDate}
            getDayHref={(date) =>
              `/calendar?year=${currentMonth.getFullYear()}&month=${
                currentMonth.getMonth() + 1
              }&date=${date}`
            }
          />

          <aside className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <h2 className={styles.detailTitle}>{calendarData.selectedDate}</h2>
              <p className={styles.detailDescription}>
                선택한 날짜에 작성한 일기
              </p>
            </div>

            {calendarData.selectedDiaries.length > 0 ? (
              <div className={styles.diaryList}>
                {calendarData.selectedDiaries.map((diary) => (
                  <Link
                    key={diary.id}
                    href={URL().DIARY_DETAIL(diary.id)}
                    className={styles.diaryCard}
                  >
                    <div className={styles.diaryCardHeader}>
                      <div className={styles.emotionStack}>
                        {diary.emotions.slice(0, 3).map((emotion) => (
                          <Image
                            key={emotion.id}
                            src={emotion.image}
                            alt={emotion.label}
                            width={24}
                            height={24}
                            className={styles.diaryEmotionImage}
                          />
                        ))}
                      </div>
                      <span className={styles.privacyBadge}>
                        {diary.isPrivate ? (
                          <Lock className={styles.privacyIcon} />
                        ) : (
                          <Unlock className={styles.privacyIcon} />
                        )}
                        {diary.isPrivate ? "비공개" : "공개"}
                      </span>
                    </div>
                    <h3 className={styles.diaryTitle}>{diary.title}</h3>
                    <p className={styles.diaryContent}>{diary.content}</p>
                    <time className={styles.diaryTime}>
                      {formatToTimeAgo(new Date(diary.createdAt).toISOString())}
                    </time>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>기록된 일기가 없습니다</p>
                <p className={styles.emptyDescription}>
                  날짜를 선택하거나 오늘의 감정을 일기로 남겨보세요.
                </p>
                <Link href={URL().DIARY_NEW} className={styles.writeLink}>
                  일기 작성
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
