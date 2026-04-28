import { ImagePreviewByDiaryNew } from "@/commons/components/image-preview";
import { InputWithCssprop } from "@/commons/components/input";
import { useFormContext } from "react-hook-form";
import DiaryNewStepWriteDiaryEmotionTags from "./emotion-tags";
import {
  DIARY_CONTENT_MAX_LENGTH,
  DIARY_TITLE_MAX_LENGTH,
  type DiaryNewFormType,
} from "../form.schema";
import { InputFieldStandardSFull } from "@/commons/components/input-field";
import styles from "./styles.module.css";

export default function DiaryNewStepWriteDiary() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<DiaryNewFormType>();
  const titleLength = watch("title")?.length ?? 0;
  const contentLength = watch("content")?.length ?? 0;

  return (
    <section className={styles.sectionContainer}>
      {/* 태그 */}
      <DiaryNewStepWriteDiaryEmotionTags />
      {/* 제목 */}
      <div className={styles.fieldGroup}>
        <InputWithCssprop
          name="title"
          register={register}
          placeholder="제목을 입력하세요"
          cssprop={styles.titleInput}
          errors={errors}
        />
        <div className={styles.helperRow}>
          <span className={styles.helperText}>짧게 기억할 수 있는 제목</span>
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
      {/* 내용 */}
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
      {/* 사진 */}
      <ImagePreviewByDiaryNew multiple maxImages={3} />
      {/* 태그 */}
      <InputFieldStandardSFull
        title="태그 추가"
        name="tags"
        register={register}
        placeholder="#태그입력 (쉼표로 구분)"
      />
    </section>
  );
}
