import { InputWithCssprop } from "@/commons/components/input";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  DIARY_TITLE_MAX_LENGTH,
  type DiaryNewFormType,
} from "../form.schema";
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
  return (
    <div className={styles.fieldGroup}>
      <InputWithCssprop
        name="title"
        register={register}
        placeholder="제목을 입력해주세요"
        cssprop={styles.titleInput}
        errors={errors}
      />
      <div className={styles.helperRow}>
        <span className={errors.title?.message ? styles.errorText : styles.helperText}>
          {errors.title?.message ?? "짧게 기억할 수 있는 제목"}
        </span>
        <span
          className={
            titleLength > DIARY_TITLE_MAX_LENGTH
              ? styles.countTextError
              : styles.countText
          }
        >
          {titleLength}/{DIARY_TITLE_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
