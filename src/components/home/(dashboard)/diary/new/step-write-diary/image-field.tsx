"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useImageUpload } from "@/commons/hooks/use-image-upload";
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

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.imageHeader}>
        <label className={styles.label}>이미지</label>
        <span className={styles.imageCount}>
          {imageState.imageCount}/{imageState.maxCount}
        </span>
      </div>

      <div className={styles.imageGrid}>
        {imageState.newImages.map((image, index) => (
          <div key={image.previewUrl} className={styles.imageItem}>
            <Image
              src={image.previewUrl}
              alt="일기 이미지 미리보기"
              width={160}
              height={160}
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.imageDeleteButton}
              onClick={() => imageState.handleRemoveNew(index)}
              aria-label="이미지 삭제"
            >
              <X className={styles.imageDeleteIcon} />
            </button>
          </div>
        ))}

        {imageState.imageCount < imageState.maxCount && (
          <label className={styles.imageAddButton} htmlFor="diary-images">
            <ImagePlus className={styles.imageAddIcon} />
            <span>이미지 추가</span>
          </label>
        )}
      </div>

      <input
        id="diary-images"
        className={styles.fileInput}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={imageState.handleImageChange}
      />

      {imageState.imageError && (
        <p className={styles.errorText}>{imageState.imageError}</p>
      )}
      <p className={styles.helperText}>이미지는 최대 3개까지 등록할 수 있습니다.</p>
    </div>
  );
}
