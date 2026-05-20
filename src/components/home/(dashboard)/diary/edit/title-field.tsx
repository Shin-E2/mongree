import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  DIARY_TITLE_MAX_LENGTH,
  type DiaryNewFormType,
} from "@/components/home/(dashboard)/diary/new/form.schema";
import styles from "./styles.module.css";

interface TitleFieldProps {
  register: UseFormRegister<DiaryNewFormType>;
  errors: FieldErrors<DiaryNewFormType>;
  titleLength: number;
}

export default function TitleField({
  register,
  errors,
  titleLength,
}: TitleFieldProps) {
  const hasError = Boolean(errors.title?.message);
  const isOverLimit = titleLength > DIARY_TITLE_MAX_LENGTH;

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor="title">
        제목
      </label>
      <input
        id="title"
        className={styles.titleInput}
        placeholder="제목을 입력해주세요"
        {...register("title")}
      />
      <div className={styles.helperRow}>
        <span className={hasError ? styles.errorText : styles.helperText}>
          {errors.title?.message ?? "짧게 기억할 수 있는 제목"}
        </span>
        <span className={isOverLimit ? styles.countTextError : styles.countText}>
          {titleLength}/{DIARY_TITLE_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
