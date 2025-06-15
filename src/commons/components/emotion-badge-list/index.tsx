import { EmotionBadge } from "../emotion-badge";
import styles from "./styles.module.css";
import type { EmotionBadgeListProps } from "./types";

export function EmotionBadgeList({
  emotions,
  maxVisible = 3, // 기본 3개까지 표시
  className,
}: EmotionBadgeListProps) {
  const visibleEmotions = emotions.slice(0, maxVisible);
  const remainingCount = emotions.length - visibleEmotions.length;

  if (!emotions || emotions.length === 0) {
    return null; // 감정이 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.badgeList}>
        {visibleEmotions.map((emotion) => (
          <EmotionBadge
            key={emotion.id}
            emotion={emotion}
            className={styles.badgeItem} // 필요한 스타일 적용
          />
        ))}
      </div>
      {remainingCount > 0 && (
        <span className={styles.moreText}>외 {remainingCount}개</span>
      )}
    </div>
  );
}
