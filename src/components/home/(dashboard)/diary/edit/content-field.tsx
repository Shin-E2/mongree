import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  DIARY_CONTENT_MAX_LENGTH,
  type DiaryNewFormType,
} from "@/components/home/(dashboard)/diary/new/form.schema";
import styles from "./styles.module.css";

interface ContentFieldProps {
  register: UseFormRegister<DiaryNewFormType>;
  errors: FieldErrors<DiaryNewFormType>;
  contentLength: number;
}

export default function ContentField({
  register,
  errors,
  contentLength,
}: ContentFieldProps) {
  const hasError = Boolean(errors.content?.message);
  const isOverLimit = contentLength > DIARY_CONTENT_MAX_LENGTH;

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor="content">
        내용
      </label>
      <textarea
        id="content"
        className={styles.contentTextarea}
        placeholder="오늘 하루는 어땠나요?"
        {...register("content")}
      />
      <div className={styles.helperRow}>
        <span className={hasError ? styles.errorText : styles.helperText}>
          {errors.content?.message ?? "길게 써도 괜찮아요"}
        </span>
        <span className={isOverLimit ? styles.countTextError : styles.countText}>
          {contentLength.toLocaleString()}/
          {DIARY_CONTENT_MAX_LENGTH.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
