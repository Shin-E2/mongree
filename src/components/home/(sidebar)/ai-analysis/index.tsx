import { Sparkles } from "lucide-react";
import styles from "./styles.module.css";

export default function HomeAIAnalysis() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>AI 감정 분석</h3>
      <div className={styles.comingSoon}>
        <Sparkles className={styles.icon} />
        <p className={styles.description}>
          일기를 더 쌓으면 AI가 나의 감정 패턴을 분석해드려요.
          곧 만나볼 수 있습니다.
        </p>
      </div>
    </div>
  );
}
