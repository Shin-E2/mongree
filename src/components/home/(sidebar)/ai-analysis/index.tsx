import Link from "next/link";
import { URL } from "@/commons/constants/global-url";
import { Sparkles } from "lucide-react";
import styles from "./styles.module.css";

export default function HomeAIAnalysis() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>AI 감정 리포트</h3>
        <Link href={URL().AI_REPORT} className={styles.link}>
          보기
        </Link>
      </div>
      <div className={styles.comingSoon}>
        <Sparkles className={styles.icon} />
        <p className={styles.description}>
          이번 달 일기와 감정 흐름을 바탕으로 나를 더 잘 이해할 수 있게 정리해드려요.
        </p>
      </div>
    </div>
  );
}
