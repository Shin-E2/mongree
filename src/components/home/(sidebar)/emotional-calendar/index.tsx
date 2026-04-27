import Image from "next/image";
import type { HomeCalendarEntry } from "@/app/(dashboard)/home/action";
import styles from "./styles.module.css";

interface HomeEmotionalCalendarProps {
  monthLabel: string;
  entries: HomeCalendarEntry[];
}

export default function HomeEmotionalCalendar({
  monthLabel,
  entries,
}: HomeEmotionalCalendarProps) {
  const entryMap = new Map(entries.map((entry) => [entry.date, entry]));
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const blanks = Array.from({ length: firstDay.getDay() });
  const days = Array.from({ length: lastDay.getDate() }, (_, index) => {
    const day = index + 1;
    const dateKey = new Date(year, month, day).toISOString().slice(0, 10);
    return { day, entry: entryMap.get(dateKey) };
  });

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>{monthLabel}</h2>
        <div className={styles.weekGrid}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <span key={day} className={styles.weekday}>
              {day}
            </span>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {blanks.map((_, index) => (
            <div key={`blank-${index}`} className={styles.emptyCell} />
          ))}
          {days.map(({ day, entry }) => (
            <div key={day} className={styles.dayCell}>
              <span className={styles.dayNumber}>{day}</span>
              {entry && (
                <div className={styles.emotionMarker}>
                  <Image
                    src={entry.emotionImage}
                    alt={entry.emotionLabel}
                    width={24}
                    height={24}
                  />
                  {entry.count > 1 && (
                    <span className={styles.countText}>{entry.count}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
