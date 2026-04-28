import { ModalStandardFitFit } from "@/commons/components/modal";
import { type DiaryDeleteModalProps } from "./types";
import styles from "./styles.module.css";

export default function DiaryDeleteModal({
  isOpen,
  onClose,
  deleteError,
  isPending,
  handleDeleteWithError,
}: DiaryDeleteModalProps) {
  return (
    <ModalStandardFitFit
      isOpen={isOpen}
      onClose={isPending ? undefined : onClose}
      title="일기 삭제"
    >
      <div className={styles.modalContent} aria-busy={isPending}>
        <p className={styles.message}>이 일기를 정말 삭제하시겠습니까?</p>
        {deleteError && <p className={styles.errorMessage}>{deleteError}</p>}
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDeleteWithError}
            disabled={isPending}
            className={styles.deleteButton}
          >
            {isPending ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </ModalStandardFitFit>
  );
}
