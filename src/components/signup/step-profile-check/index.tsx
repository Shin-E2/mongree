import { ImagePreviewByProfile } from "@/commons/components/image-preview";
import styles from "./styles.module.css";

export default function SignupStepProfileCheck() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>프로필 설정</h2>
      <div className={styles.imagePreviewWrapper}>
        {/* 이미지 미리보기 */}
        <ImagePreviewByProfile />
      </div>
    </div>
  );
}
