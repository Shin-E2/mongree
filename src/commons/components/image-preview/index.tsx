"use client";

import Image from "next/image";
import { ButtonIconDelete } from "../button-icon";
import styles from "./styles.module.css";
import type {
  IImagePreviewBaseProps,
  IImagePreviewByDiaryNewProps,
  IImagePreviewByProfileProps,
} from "./types";
import { type FieldValues, type Path } from "react-hook-form";
import { InputStandardSFull } from "../input";
import { ImageIcon } from "lucide-react";
import { memo, useCallback } from "react";
import useImagePreview from "./hook";

// 이미지 미리보기 컴포넌트
function ImagePreviewBase<T extends FieldValues>({
  cssprop,
  multiple = false,
  maxImages = 1,
  className,
}: IImagePreviewBaseProps<T>) {
  const {
    preview,
    selectedImage,
    images,
    handleDeleteImage,
    register,
    handleFileChange,
  } = useImagePreview({ multiple, maxImages });

  // 이미지 삭제 핸들러를 메모이제이션
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
            <div key={index} className={styles.imageItemWrapper}>
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
      <div className={styles.singleImageGroup}>
        <label
          htmlFor="photo"
          className={`${cssprop} ${styles.common} ${className || ""}`}
        >
          <Image src={preview} alt="Preview" layout="fill" objectFit="cover" />
          {/* 삭제 아이콘 오버레이 */}
          <ButtonIconDelete
            onClick={memoizedHandleDeleteImage()}
            className={styles.singleImageDeleteButton}
          />
        </label>
      </div>
      {/* 숨김 파일 입력 */}
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

// 메모이제이션된 컴포넌트
const MemoizedImagePreviewBase = memo(
  ImagePreviewBase
) as typeof ImagePreviewBase;

// 프로필 이미지
export const ImagePreviewByProfile = <T extends FieldValues>({
  ...rest
}: IImagePreviewByProfileProps<T>) => {
  return <MemoizedImagePreviewBase {...rest} cssprop={styles.profile} />;
};

// 일기 등록하기
export const ImagePreviewByDiaryNew = <T extends FieldValues>({
  className,
  ...rest
}: IImagePreviewByDiaryNewProps<T>) => {
  return (
    <MemoizedImagePreviewBase
      {...rest}
      cssprop={className ?? ""}
      multiple
      maxImages={3}
    />
  );
};

export default MemoizedImagePreviewBase;
