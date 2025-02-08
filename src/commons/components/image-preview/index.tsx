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
import useImagePreview from "./hook";
import { ImageIcon } from "lucide-react";

// 이미지 미리보기 컴포넌트
export default function ImagePreviewBase<T extends FieldValues>({
  cssprop,
  multiple = false,
  maxImages = 1,
}: IImagePreviewBaseProps<T>) {
  const {
    preview,
    selectedImage,
    images,
    handleDeleteImage,
    register,
    handleFileChange,
  } = useImagePreview({ multiple, maxImages });

  if (multiple) {
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 w-fit">
          {images.length < maxImages && (
            <>
              <label
                htmlFor="photo"
                className="flex-shrink-0 w-[137px] h-[137px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 cursor-pointer"
              >
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">사진 추가</span>
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
            <div key={index} className="relative group flex-shrink-0">
              <div className="w-[137px] h-[137px] rounded-lg overflow-hidden">
                <Image
                  src={image.previewURL}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <ButtonIconDelete
                onClick={handleDeleteImage(index)}
                className="!top-2 !right-2 !inset-auto w-5 h-5 opacity-0 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group">
        <label htmlFor="photo" className={`${cssprop} ${styles.common}`}>
          <Image src={preview} alt="Preview" layout="fill" objectFit="cover" />
          {/* 삭제 아이콘 오버레이 */}
          <ButtonIconDelete
            onClick={handleDeleteImage}
            className={`invisible ${selectedImage && `group-hover:visible`}`}
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

// 프로필 이미지
export const ImagePreviewByProfile = <T extends FieldValues>({
  ...rest
}: IImagePreviewByProfileProps<T>) => {
  return <ImagePreviewBase {...rest} cssprop={styles.profile} />;
};

// 일기 등록하기
export const ImagePreviewByDiaryNew = <T extends FieldValues>({
  className,
  ...rest
}: IImagePreviewByDiaryNewProps<T>) => {
  return (
    <ImagePreviewBase
      {...rest}
      cssprop={className ?? ""}
      multiple
      maxImages={3}
    />
  );
};
