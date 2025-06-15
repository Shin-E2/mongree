import Link from "next/link";
import HomeDiaryCard from "../diary-card";
import { EMOTIONS } from "@/mock/emotions";
import styles from "./styles.module.css";

export default function HomeRecentDiary() {
  const sadEmotion = EMOTIONS.find((e) => e.id === "sad");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>최근 일기</h2>
        <Link href="/diary" className={styles.link}>
          모두 보기
        </Link>
      </div>
      <div className={styles.grid}>
        <HomeDiaryCard
          title="졸리다"
          content="침대가 좋아"
          date="24.10.30"
          emotion={sadEmotion!}
        />
        {/* 기타 등등의 일기들 */}
      </div>
    </div>
  );
}
