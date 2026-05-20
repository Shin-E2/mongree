import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  DIARY_CONTENT_MAX_LENGTH,
  type DiaryNewFormType,
} from "../form.schema";
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
  return (
    <div className={styles.fieldGroup}>
      <textarea
        {...register("content")}
        placeholder="오늘 하루는 어땠나요?"
        className={styles.contentTextArea}
      />
      <div className={styles.helperRow}>
        <span className={errors.content?.message ? styles.errorText : styles.helperText}>
          {errors.content?.message ?? "길게 써도 괜찮아요"}
        </span>
        <span
          className={
            contentLength > DIARY_CONTENT_MAX_LENGTH
              ? styles.countTextError
              : styles.countText
          }
        >
          {contentLength.toLocaleString()}/
          {DIARY_CONTENT_MAX_LENGTH.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
