import { EmotionBadge } from "@/commons/components/emotion-badge";
import { Emotion } from "@/mock/emotions";
import styles from "./styles.module.css";

interface IHomeDiaryCardProps {
  title: string;
  content: string;
  date: string;
  emotion: Emotion;
}

export default function HomeDiaryCard({
  title,
  content,
  date,
  emotion,
}: IHomeDiaryCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <EmotionBadge emotion={emotion} className={styles.emotionBadge} />
        <span className={styles.title}>{title}</span>
      </div>
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        <span className={styles.date}>{date}</span>
        <button className={styles.detailButton}>자세히</button>
      </div>
    </div>
  );
}
