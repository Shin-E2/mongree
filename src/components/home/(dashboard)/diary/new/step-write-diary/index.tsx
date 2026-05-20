"use client";

import { useFormContext } from "react-hook-form";
import DiaryNewStepWriteDiaryEmotionTags from "./emotion-tags";
import TitleField from "./title-field";
import ContentField from "./content-field";
import ImageField from "./image-field";
import TagField from "./tag-field";
import type { DiaryNewFormType } from "../form.schema";
import styles from "./styles.module.css";

export default function DiaryNewStepWriteDiary() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DiaryNewFormType>();

  const titleLength = watch("title")?.length ?? 0;
  const contentLength = watch("content")?.length ?? 0;
  const tags = watch("tags") ?? [];

  return (
    <section className={styles.sectionContainer}>
      <DiaryNewStepWriteDiaryEmotionTags />
      <TitleField
        register={register}
        errors={errors}
        titleLength={titleLength}
      />
      <ContentField
        register={register}
        errors={errors}
        contentLength={contentLength}
      />
      <ImageField />
      <TagField tags={tags} setValue={setValue} />
    </section>
  );
}
