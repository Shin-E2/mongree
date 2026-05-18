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
          생성하기
        </Link>
      </div>
      <div className={styles.reportPreview}>
        <Sparkles className={styles.icon} />
        <p className={styles.description}>
          최근 일기 기반 감정 흐름과 추천 행동을 리포트로 정리해드려요.
        </p>
      </div>
    </div>
  );
}
