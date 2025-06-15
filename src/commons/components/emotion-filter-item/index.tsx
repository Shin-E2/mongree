import Image from "next/image";
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
      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
        isSelected
          ? `${emotion.bgColor} ${emotion.textColor}`
          : "hover:bg-gray-50"
      }`}
    >
      <Image
        src={emotion.image}
        alt={emotion.label}
        width={100}
        height={100}
        className={styles.image}
      />
      <span className={styles.labelText}>{emotion.label}</span>
    </button>
  );
}
