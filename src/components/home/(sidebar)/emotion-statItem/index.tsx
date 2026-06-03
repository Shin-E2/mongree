import Image from "next/image";
import { getEmotionColor } from "@/lib/emotion-colors";
import styles from "./styles.module.css";

interface EmotionStatItemProps {
  emotion: string; // 감정 이미지 경로
  emotionId: string; // 색 매핑용 감정 id
  label: string;
  percentage: number;
  count: number;
  rank: number; // 분포 순위 (1위 강조)
}

export function HomeEmotionStatItem({
  emotion,
  emotionId,
  label,
  percentage,
  count,
  rank,
}: EmotionStatItemProps) {
  const color = getEmotionColor(emotionId);

  return (
    <div className={styles.row} data-top={rank === 1 ? "" : undefined}>
      <div
        className={styles.thumb}
        style={{ background: `color-mix(in oklch, ${color} 16%, transparent)` }}
      >
        <Image
          src={emotion}
          alt={label}
          width={28}
          height={28}
          className={styles.thumbImage}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.head}>
          <span className={styles.label}>{label}</span>
          <span className={styles.percent}>{percentage}%</span>
        </div>
        <div className={styles.track}>
          <div
            className={styles.fill}
            style={{ width: `${percentage}%`, background: color }}
          />
        </div>
      </div>

      <span className={styles.count}>{count}회</span>
    </div>
  );
}
