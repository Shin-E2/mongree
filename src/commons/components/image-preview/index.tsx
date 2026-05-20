"use client";

import Image from "next/image";
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
  className,
}: IImagePreviewBaseProps<T>) {
  const { preview, handleDeleteImage, register, handleFileChange } =
    useImagePreview();

  const memoizedHandleDeleteImage = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      handleDeleteImage()(event);
    },
    [handleDeleteImage]
  );

  return (
    <>
      <div className={`${styles.singleImageGroup} group`}>
        <label
          htmlFor="photo"
          className={`${cssprop} ${styles.common} ${className || ""}`}
        >
          <Image src={preview} alt="Preview" fill className={styles.previewImage} />
          <ButtonIconDelete
            onClick={memoizedHandleDeleteImage}
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
