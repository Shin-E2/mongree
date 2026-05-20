"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useImageUpload } from "@/commons/hooks/use-image-upload";
import ImageUploadField from "../../shared/image-upload-field";
import type { DiaryNewFormType } from "../form.schema";
import styles from "./styles.module.css";

export default function ImageField() {
  const { setValue } = useFormContext<DiaryNewFormType>();
  const imageState = useImageUpload();

  useEffect(() => {
    setValue(
      "images",
      imageState.newImages.map((image) => image.file),
      { shouldDirty: true, shouldValidate: true }
    );
  }, [imageState.newImages, setValue]);

  const notice = (
    <p className={styles.helperText}>이미지는 최대 3개까지 등록할 수 있습니다.</p>
  );

  return <ImageUploadField imageState={imageState} styles={styles} notice={notice} />;
}
