import Image from "next/image";
import { EMOTIONS } from "../../../../../../../mock/emotions";
import { useFormContext } from "react-hook-form";
import styles from "./styles.module.css";

export default function DiaryNewStepWriteDiaryEmotionTags() {
  const { watch } = useFormContext();
  const selectedEmotions = watch("emotions");

  return (
    <div className={styles.container}>
      {selectedEmotions.map((emotionId: string) => {
        const emotion = EMOTIONS.find((e) => e.id === emotionId);
        return (
          <span
            key={emotionId}
            className={`${styles.emotionTag} ${emotion?.bgColor} ${emotion?.textColor}`}
          >
            <Image
              src={emotion?.image!}
              alt={emotion?.label!}
              width={4}
              height={4}
              className={styles.emotionImage}
            />
            {emotion?.label}
          </span>
        );
      })}
    </div>
  );
}
