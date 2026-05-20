import styles from "./styles.module.css";

interface VisibilityFieldProps {
  isPrivate: boolean;
  onChange: (nextValue: boolean) => void;
}

export default function VisibilityField({
  isPrivate,
  onChange,
}: VisibilityFieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>공개 여부</label>
      <div className={styles.segmented}>
        <button
          type="button"
          className={`${styles.segmentButton} ${
            isPrivate ? styles.segmentButtonActive : ""
          }`}
          onClick={() => onChange(true)}
        >
          비공개
        </button>
        <button
          type="button"
          className={`${styles.segmentButton} ${
            !isPrivate ? styles.segmentButtonActive : ""
          }`}
          onClick={() => onChange(false)}
        >
          공개
        </button>
      </div>
    </div>
  );
}
