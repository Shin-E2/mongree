import styles from "./styles.module.css";

interface FormActionsProps {
  isPending: boolean;
  isValid: boolean;
  onCancel: () => void;
}

export default function FormActions({
  isPending,
  isValid,
  onCancel,
}: FormActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        className={styles.cancelButton}
        type="button"
        onClick={onCancel}
        disabled={isPending}
      >
        취소
      </button>
      <button
        className={styles.submitButton}
        type="submit"
        disabled={isPending || !isValid}
      >
        {isPending ? "저장 중..." : "수정 완료"}
      </button>
    </div>
  );
}
