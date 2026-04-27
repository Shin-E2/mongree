import Link from "next/link";
import type { HomeRecentDiary as HomeRecentDiaryItem } from "@/app/(dashboard)/home/action";
import HomeDiaryCard from "../diary-card";
import styles from "./styles.module.css";

interface HomeRecentDiaryProps {
  diaries: HomeRecentDiaryItem[];
}

export default function HomeRecentDiary({ diaries }: HomeRecentDiaryProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>최근 일기</h2>
        <Link href="/diary" className={styles.link}>
          모두 보기
        </Link>
      </div>
      <div className={styles.diaryGrid}>
        {diaries.length > 0 ? (
          diaries.map((diary) => (
            <HomeDiaryCard
              key={diary.id}
              id={diary.id}
              title={diary.title}
              content={diary.content}
              date={new Date(diary.createdAt).toLocaleDateString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
              emotion={diary.emotion}
            />
          ))
        ) : (
          <p className={styles.emptyText}>최근 작성한 일기가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
