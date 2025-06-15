import type { PublicDiary } from "@/app/(dashboard)/community/types";
import CommunityDiaryCard from "../diary-card";
import styles from "./styles.module.css";

export default function CommunityDiaryList({
  diaries,
}: {
  diaries: PublicDiary[];
}) {
  return (
    <div className={styles.diaryListGrid}>
      {diaries.map((diary, idx) => (
        <CommunityDiaryCard key={diary.id ?? idx} diary={diary} />
      ))}
    </div>
  );
}
