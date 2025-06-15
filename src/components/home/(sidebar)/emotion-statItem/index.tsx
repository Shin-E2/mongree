import Image from "next/image";
import { ProgressBarBase } from "@/commons/components/progress-bar";
import styles from "./styles.module.css";

interface EmotionStatItemProps {
  emotion: string;
  percentage: number;
  color: string;
}

export function HomeEmotionStatItem({
  emotion,
  percentage,
  color,
}: EmotionStatItemProps) {
  return (
    <div className={styles.container}>
      <Image
        src={emotion}
        alt="감정이모지"
        width={100}
        height={100}
        className={styles.emotionImage}
      />

      <ProgressBarBase progress={percentage} cssprop={`bg-${color}-500`} />
      <span className={styles.percentageText}>{percentage}%</span>
    </div>
  );
}
