import Image from "next/image";
import { getEmotionCssVars } from "@/commons/constants/emotions";
import { IEmotionFilterItemProps } from "./types";
import styles from "./styles.module.css";

export default function EmotionFilterItem({
  emotion,
  onClick,
  isSelected,
}: IEmotionFilterItemProps) {
  return (
    <button
      key={emotion.id}
      onClick={() => onClick(emotion.id)}
      className={`${styles.button} ${isSelected ? styles.selected : ""}`}
      style={getEmotionCssVars(emotion)}
      type="button"
    >
      <span className={styles.imageWrap} aria-hidden="true">
        <Image
          src={emotion.image}
          alt=""
          width={20}
          height={20}
          className={styles.image}
        />
      </span>
      <span className={styles.labelText}>{emotion.label}</span>
    </button>
  );
}