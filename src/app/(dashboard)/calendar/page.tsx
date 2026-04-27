import { HeaderStandardMFull } from "@/commons/components/header";
import { Calendar } from "lucide-react";
import styles from "./styles.module.css";

export default function CalendarPage() {
  return (
    <div className={styles.pageContainer}>
      <HeaderStandardMFull
        title="감정 캘린더"
        description="날짜별로 감정 기록을 확인하세요"
      />
      <div className={styles.contentWrapper}>
        <div className={styles.comingSoonCard}>
          <Calendar className={styles.icon} />
          <h2 className={styles.title}>준비 중입니다</h2>
          <p className={styles.description}>
            날짜별 감정 기록을 한눈에 확인할 수 있는 캘린더 기능을 준비 중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
