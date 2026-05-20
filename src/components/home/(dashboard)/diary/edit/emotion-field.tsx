import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { EMOTIONS } from "@/mock/emotions";
import styles from "./styles.module.css";

interface EmotionFieldProps {
  selectedEmotions: string[];
  errorMessage?: string;
  onToggle: (emotionId: string) => void;
}

export default function EmotionField({
  selectedEmotions,
  errorMessage,
  onToggle,
}: EmotionFieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>감정</label>
      <div className={styles.emotionGrid}>
        {EMOTIONS.map((emotion) => (
          <ButtonOptionEmotion
            key={emotion.id}
            emotion={emotion}
            isSelected={selectedEmotions.includes(emotion.id)}
            onClick={() => onToggle(emotion.id)}
            type="button"
          />
        ))}
      </div>
      {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
    </div>
  );
}
