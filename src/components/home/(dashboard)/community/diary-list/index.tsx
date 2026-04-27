import type {
  CommunityLoginUser,
  PublicDiary,
} from "@/app/(dashboard)/community/types";
import CommunityDiaryCard from "../diary-card";
import styles from "./styles.module.css";

export default function CommunityDiaryList({
  diaries,
  loginUser,
}: {
  diaries: PublicDiary[];
  loginUser: CommunityLoginUser;
}) {
  if (diaries.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>조건에 맞는 공개 일기가 없습니다.</p>
        <p className={styles.emptyDescription}>
          검색어를 바꾸거나 선택한 감정 필터를 조정해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.diaryListGrid}>
      {diaries.map((diary, idx) => (
        <CommunityDiaryCard
          key={diary.id ?? idx}
          diary={diary}
          loginUser={loginUser}
        />
      ))}
    </div>
  );
}
