"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { memo, useCallback } from "react";
import { type FieldValues, type Path } from "react-hook-form";
import { ButtonIconDelete } from "../button-icon";
import { InputStandardSFull } from "../input";
import type {
  IImagePreviewBaseProps,
  IImagePreviewByProfileProps,
} from "./types";
import useImagePreview from "./hook";
import styles from "./styles.module.css";

function ImagePreviewBase<T extends FieldValues>({
  cssprop,
  multiple = false,
  maxImages = 1,
  className,
}: IImagePreviewBaseProps<T>) {
  const {
    preview,
    images,
    handleDeleteImage,
    register,
    handleFileChange,
  } = useImagePreview({ multiple, maxImages });

  const memoizedHandleDeleteImage = useCallback(
    (index?: number) => (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      handleDeleteImage(index)(event);
    },
    [handleDeleteImage]
  );

  if (multiple) {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.imageGrid}>
          {images.length < maxImages && (
            <>
              <label htmlFor="photo" className={styles.addPhotoLabel}>
                <ImageIcon className={styles.addPhotoIcon} />
                <span className={styles.addPhotoText}>사진 추가</span>
              </label>

              <InputStandardSFull
                id="photo"
                name={"images" as Path<T>}
                register={register}
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </>
          )}

          {images.map((image, index) => (
            <div key={index} className={`${styles.imageItemWrapper} group`}>
              <div className={styles.imageItemThumbnailContainer}>
                <Image
                  src={image.previewURL}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  className={styles.imageItemThumbnail}
                />
              </div>
              <ButtonIconDelete
                onClick={memoizedHandleDeleteImage(index)}
                className={styles.deleteButtonOverlay}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.singleImageGroup} group`}>
        <label
          htmlFor="photo"
          className={`${cssprop} ${styles.common} ${className || ""}`}
        >
          <Image src={preview} alt="Preview" layout="fill" objectFit="cover" />
          <ButtonIconDelete
            onClick={memoizedHandleDeleteImage()}
            className={styles.singleImageDeleteButton}
          />
        </label>
      </div>
      <InputStandardSFull
        id="photo"
        name={"profileImage" as Path<T>}
        register={register}
        type="file"
        onChange={handleFileChange}
      />
    </>
  );
}

const MemoizedImagePreviewBase = memo(
  ImagePreviewBase
) as typeof ImagePreviewBase;

export const ImagePreviewByProfile = <T extends FieldValues>({
  ...rest
}: IImagePreviewByProfileProps<T>) => {
  return <MemoizedImagePreviewBase {...rest} cssprop={styles.profile} />;
};

export default MemoizedImagePreviewBase;
