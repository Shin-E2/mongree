import { HeaderStandardMFull } from "@/commons/components/header";
import { BarChart2 } from "lucide-react";
import styles from "./styles.module.css";

export default function StatisticsPage() {
  return (
    <div className={styles.pageContainer}>
      <HeaderStandardMFull
        title="감정 통계"
        description="나의 감정 패턴을 분석해보세요"
      />
      <div className={styles.contentWrapper}>
        <div className={styles.comingSoonCard}>
          <BarChart2 className={styles.icon} />
          <h2 className={styles.title}>준비 중입니다</h2>
          <p className={styles.description}>
            월별·주별 감정 분포와 트렌드를 시각화하는 통계 기능을 준비 중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
