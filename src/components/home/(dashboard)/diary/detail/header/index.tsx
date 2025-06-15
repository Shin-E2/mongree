import { ChevronLeft, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DiaryDetailHeaderProps } from "./types";
import styles from "./styles.module.css";

export default function DiaryDetailHeader({
  isOwner,
  isPrivate,
  setShowDeleteModal,
}: DiaryDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ChevronLeft className={`${styles.iconBase} ${styles.backIcon}`} />
          <span className={styles.backButtonText}>돌아가기</span>
        </button>
        <div className={styles.actionButtons}>
          {!isPrivate && (
            <button className={styles.shareButton} title="공유하기">
              <Share2 className={styles.iconBase} />
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className={styles.deleteButton}
              title="삭제하기"
            >
              <Trash2 className={styles.iconBase} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
