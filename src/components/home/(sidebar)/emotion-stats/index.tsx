import { HomeEmotionStatItem } from "../emotion-statItem";
import styles from "./styles.module.css";

export default function HomeEmotionStats() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>이번 달 감정 분포</h3>
      <div className={styles.listContainer}>
        <HomeEmotionStatItem
          emotion="/image/emotions/sad.svg"
          percentage={25}
          color="blue"
        />
        <HomeEmotionStatItem
          emotion="/image/emotions/angry.svg"
          percentage={15}
          color="blue"
        />
        <HomeEmotionStatItem
          emotion="/image/emotions/joyful.svg"
          percentage={60}
          color="blue"
        />
        {/* 기타 등등의 감정 */}
      </div>
    </div>
  );
}
