import Image from "next/image";
import Link from "next/link";
import type { EmotionCalendarEntry, EmotionCalendarProps } from "./types";
import styles from "./styles.module.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarDays(monthDate: string, entries: EmotionCalendarEntry[]) {
  const entryMap = new Map(entries.map((entry) => [entry.date, entry]));
  const baseDate = new Date(monthDate);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const blanks = Array.from({ length: firstDay.getDay() });

  const days = Array.from({ length: lastDay.getDate() }, (_, index) => {
    const day = index + 1;
    const dateKey = getLocalDateKey(new Date(year, month, day));
    return { day, dateKey, entry: entryMap.get(dateKey) };
  });

  return { blanks, days };
}

export default function EmotionCalendar({
  monthLabel,
  monthDate,
  entries,
  variant = "compact",
  selectedDate,
  getDayHref,
}: EmotionCalendarProps) {
  const { blanks, days } = getCalendarDays(monthDate, entries);
  const isFull = variant === "full";
  const todayKey = getLocalDateKey(new Date());

  const renderDayContent = ({
    day,
    entry,
  }: {
    day: number;
    entry?: EmotionCalendarEntry;
  }) => (
    <>
      <span className={styles.dayNumber}>{day}</span>
      {entry && (
        <div className={isFull ? styles.fullEmotionMarker : styles.emotionMarker}>
          <Image
            src={entry.emotion.image}
            alt={entry.emotion.label}
            width={isFull ? 28 : 24}
            height={isFull ? 28 : 24}
            className={styles.emotionImage}
          />
          {entry.count > 1 && (
            <span className={styles.countText}>{entry.count}</span>
          )}
        </div>
      )}
      {isFull && entry && (
        <span className={styles.emotionLabel}>{entry.emotion.label}</span>
      )}
    </>
  );

  return (
    <section className={isFull ? styles.fullContainer : styles.container}>
      <div className={isFull ? styles.fullContentWrapper : styles.contentWrapper}>
        <h2 className={isFull ? styles.fullTitle : styles.title}>{monthLabel}</h2>
        <div className={styles.weekGrid}>
          {WEEKDAYS.map((day) => (
            <span key={day} className={styles.weekday}>
              {day}
            </span>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {blanks.map((_, index) => (
            <div key={`blank-${index}`} className={styles.emptyCell} />
          ))}
          {days.map(({ day, dateKey, entry }) => {
            const dayClassName = [
              isFull ? styles.fullDayCell : styles.dayCell,
              entry ? styles.hasEntryDayCell : "",
              selectedDate === dateKey ? styles.selectedDayCell : "",
              todayKey === dateKey ? styles.todayDayCell : "",
            ]
              .filter(Boolean)
              .join(" ");

            if (getDayHref) {
              return (
                <Link
                  key={dateKey}
                  href={getDayHref(dateKey)}
                  className={dayClassName}
                >
                  {renderDayContent({ day, entry })}
                </Link>
              );
            }

            return (
              <div key={dateKey} className={dayClassName}>
                {renderDayContent({ day, entry })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
