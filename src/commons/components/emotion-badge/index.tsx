import Image from "next/image";
import { getEmotionById, getEmotionCssVars } from "@/commons/constants/emotions";
import styles from "./styles.module.css";
import type { EmotionBadgeProps } from "./types";

export function EmotionBadge({ emotion, className }: EmotionBadgeProps) {
  const emotionMeta = getEmotionById(emotion.id);
  const imageSrc = emotion.image ?? emotionMeta?.image ?? "/image/emotions/calm.svg";

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      style={emotionMeta ? getEmotionCssVars(emotionMeta) : undefined}
      title={emotion.label}
    >
      <Image
        src={imageSrc}
        alt={emotion.label}
        width={100}
        height={100}
        className={styles.image}
      />
    </div>
  );
}