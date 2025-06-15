import styles from "./styles.module.css";
import { DiaryDeletedMessageProps } from "./types";

export default function DiaryDeletedMessage({
  onBack,
}: DiaryDeletedMessageProps) {
  return (
    <div className={styles.container}>
      <p>일기가 삭제되었습니다.</p>
      <button onClick={onBack} className={styles.backButton}>
        돌아가기
      </button>
    </div>
  );
}
