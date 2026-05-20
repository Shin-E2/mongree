import type { UseFormRegister } from "react-hook-form";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";
import styles from "./styles.module.css";

interface TagFieldProps {
  register: UseFormRegister<DiaryNewFormType>;
  defaultValue: string;
}

export default function TagField({ register, defaultValue }: TagFieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor="tags">
        태그
      </label>
      <input
        id="tags"
        className={styles.textInput}
        placeholder="쉼표로 구분해서 입력해주세요"
        defaultValue={defaultValue}
        {...register("tags")}
      />
    </div>
  );
}
