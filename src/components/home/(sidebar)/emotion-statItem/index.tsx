import Image from "next/image";
import ProgressBarBase from "@/commons/components/progress-bar";
import styles from "./styles.module.css";

interface EmotionStatItemProps {
  emotion: string;
  label: string;
  percentage: number;
  count: number;
  color: string;
}

export function HomeEmotionStatItem({
  emotion,
  label,
  percentage,
  count,
  color,
}: EmotionStatItemProps) {
  return (
    <div className={styles.container}>
      <Image
        src={emotion}
        alt={label}
        width={100}
        height={100}
        className={styles.emotionImage}
      />

      <ProgressBarBase progress={percentage} cssprop={`bg-${color}-500`} />
      <span className={styles.percentageText}>
        {percentage}% · {count}회
      </span>
    </div>
  );
}
