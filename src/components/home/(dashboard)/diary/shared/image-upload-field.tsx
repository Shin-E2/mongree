import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { useImageUpload } from "@/commons/hooks/use-image-upload";

type ImageState = ReturnType<typeof useImageUpload>;
type ImageUploadFieldStyles = Record<string, string>;

interface ImageUploadFieldProps {
  imageState: ImageState;
  styles: ImageUploadFieldStyles;
  notice: ReactNode;
  inputId?: string;
}

export default function ImageUploadField({
  imageState,
  styles,
  notice,
  inputId = "diary-images",
}: ImageUploadFieldProps) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.imageHeader}>
        <label className={styles.label}>이미지</label>
        <span className={styles.imageCount}>
          {imageState.imageCount}/{imageState.maxCount}
        </span>
      </div>

      <div className={styles.imageGrid}>
        {imageState.existingImages.map((image) => (
          <div key={image.id} className={styles.imageItem}>
            <Image
              src={image.url}
              alt="기존 일기 이미지"
              width={160}
              height={160}
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.imageDeleteButton}
              onClick={() => imageState.handleRemoveExisting(image.id)}
              aria-label="기존 이미지 삭제"
            >
              <X className={styles.imageDeleteIcon} />
            </button>
          </div>
        ))}

        {imageState.newImages.map((image, index) => (
          <div key={image.previewUrl} className={styles.imageItem}>
            <Image
              src={image.previewUrl}
              alt="새 일기 이미지"
              width={160}
              height={160}
              className={styles.previewImage}
            />
            <button
              type="button"
              className={styles.imageDeleteButton}
              onClick={() => imageState.handleRemoveNew(index)}
              aria-label="새 이미지 삭제"
            >
              <X className={styles.imageDeleteIcon} />
            </button>
          </div>
        ))}

        {imageState.imageCount < imageState.maxCount && (
          <label className={styles.imageAddButton} htmlFor={inputId}>
            <ImagePlus className={styles.imageAddIcon} />
            <span>이미지 추가</span>
          </label>
        )}
      </div>

      <input
        id={inputId}
        className={styles.fileInput}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={imageState.handleImageChange}
      />
      {imageState.imageError && (
        <p className={styles.errorText}>{imageState.imageError}</p>
      )}
      {notice}
    </div>
  );
}
