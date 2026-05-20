import { X } from "lucide-react";
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { normalizeDiaryTags } from "@/lib/diary/tag-normalizer";
import type { DiaryNewFormType } from "../form.schema";
import styles from "./styles.module.css";

interface TagFieldProps {
  tags: string[];
  setValue: UseFormSetValue<DiaryNewFormType>;
}

export default function TagField({ tags, setValue }: TagFieldProps) {
  const [tagInput, setTagInput] = useState("");

  const updateTags = (nextTags: string[]) => {
    setValue("tags", nextTags, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addTags = (rawValue: string) => {
    const nextTags = normalizeDiaryTags([...tags, rawValue]);
    if (nextTags.length === tags.length) return;

    updateTags(nextTags);
    setTagInput("");
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === ",") {
      event.preventDefault();
      addTags(tagInput);
    }
  };

  const removeTag = (tagName: string) => {
    updateTags(tags.filter((tag) => tag !== tagName));
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor="diary-tags">
        태그 추가
      </label>
      <div className={styles.tagInputBox}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tagChip}>
            #{tag}
            <button
              type="button"
              className={styles.tagRemoveButton}
              onClick={() => removeTag(tag)}
              aria-label={`${tag} 태그 삭제`}
            >
              <X className={styles.tagRemoveIcon} />
            </button>
          </span>
        ))}
        <input
          id="diary-tags"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={() => addTags(tagInput)}
          className={styles.tagInput}
          placeholder="태그 입력 후 Space 또는 Enter"
        />
      </div>
      <p className={styles.helperText}>태그 안에는 공백이 들어가지 않습니다.</p>
    </div>
  );
}
