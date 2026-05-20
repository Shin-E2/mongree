"use client";

import { ImagePreviewByDiaryNew } from "@/commons/components/image-preview";
import { InputWithCssprop } from "@/commons/components/input";
import { X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import DiaryNewStepWriteDiaryEmotionTags from "./emotion-tags";
import {
  DIARY_CONTENT_MAX_LENGTH,
  DIARY_TITLE_MAX_LENGTH,
  type DiaryNewFormType,
} from "../form.schema";
import styles from "./styles.module.css";

export default function DiaryNewStepWriteDiary() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DiaryNewFormType>();
  const [tagInput, setTagInput] = useState("");
  const titleLength = watch("title")?.length ?? 0;
  const contentLength = watch("content")?.length ?? 0;
  const tags = watch("tags") ?? [];

  const addTags = (rawValue: string) => {
    const nextTags = rawValue
      .split(/[,\s]+/)
      .map((tag) => tag.replace(/^#/, "").trim())
      .filter(Boolean);

    if (nextTags.length === 0) return;

    setValue("tags", Array.from(new Set([...tags, ...nextTags])), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTagInput("");
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === ",") {
      event.preventDefault();
      addTags(tagInput);
    }
  };

  const removeTag = (tagName: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagName),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <section className={styles.sectionContainer}>
      <DiaryNewStepWriteDiaryEmotionTags />

      <div className={styles.fieldGroup}>
        <InputWithCssprop
          name="title"
          register={register}
          placeholder="제목을 입력해주세요"
          cssprop={styles.titleInput}
          errors={errors}
        />
        <div className={styles.helperRow}>
          <span
            className={errors.title?.message ? styles.errorText : styles.helperText}
          >
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

      <div className={styles.fieldGroup}>
        <textarea
          {...register("content")}
          placeholder="오늘 하루는 어땠나요?"
          className={styles.contentTextArea}
        />
        <div className={styles.helperRow}>
          <span
            className={
              errors.content?.message ? styles.errorText : styles.helperText
            }
          >
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

      <ImagePreviewByDiaryNew multiple maxImages={3} />

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
    </section>
  );
}
