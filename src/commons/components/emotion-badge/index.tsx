import Image from "next/image";
import styles from "./styles.module.css";
import type { EmotionBadgeProps } from "./types";

export function EmotionBadge({ emotion, className }: EmotionBadgeProps) {
  return (
    <div
      className={`${styles.container} ${emotion.bgColor} ${className || ""}`}
    >
      <Image
        src={emotion.image}
        alt={emotion.label}
        width={100}
        height={100}
        className={styles.image}
      />
    </div>
  );
}
