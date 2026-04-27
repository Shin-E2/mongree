import Link from "next/link";
import { EmotionBadge } from "@/commons/components/emotion-badge";
import { EMOTIONS } from "@/mock/emotions";
import styles from "./styles.module.css";

interface IHomeDiaryCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  emotion: {
    id: string;
    label: string;
    image: string;
  } | null;
}

export default function HomeDiaryCard({
  id,
  title,
  content,
  date,
  emotion,
}: IHomeDiaryCardProps) {
  const badgeEmotion =
    EMOTIONS.find((item) => item.id === emotion?.id) ?? EMOTIONS[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <EmotionBadge emotion={badgeEmotion} className={styles.emotionBadge} />
        <span className={styles.title}>{title}</span>
      </div>
      <p className={styles.content}>{content}</p>
      <div className={styles.footer}>
        <span className={styles.date}>{date}</span>
        <Link href={`/diary/${id}`} className={styles.detailButton}>
          자세히
        </Link>
      </div>
    </div>
  );
}
