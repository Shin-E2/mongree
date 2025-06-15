import styles from "./styles.module.css";

export default function HomeEmotionalCalendar() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>10월의 감정 기록</h2>
        <div className={styles.calendarPlaceholder}>
          {/* Calendar 구현하깅 */}
        </div>
      </div>
    </div>
  );
}
