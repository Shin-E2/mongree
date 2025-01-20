import Image from "next/image";
import { ButtonIconDelete } from "../button-icon";
import styles from "./styles.module.css";
import type {
  IImagePreviewBaseProps,
  IImagePreviewByProfileProps,
} from "./types";
import { type FieldValues, type Path } from "react-hook-form";
import { InputStandardSFull } from "../input";
import useImagePreview from "./hook";

// 이미지 미리보기 컴포넌트
export default function ImagePreviewBase<T extends FieldValues>({
  cssprop,
}: IImagePreviewBaseProps<T>) {
  const {
    preview,
    selectedImage,
    handleDeleteImage,
    register,
    handleFileChange,
  } = useImagePreview();

  return (
    <>
      <div className="group">
        <label htmlFor="photo" className={`${cssprop} ${styles.common}`}>
          <Image
            src={preview}
            alt="Profile Preview"
            layout="fill"
            objectFit="cover"
          />
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

// 프로필 이미지 미리보기 컴포넌트
export const ImagePreviewByProfile = <T extends FieldValues>({
  ...rest
}: IImagePreviewByProfileProps<T>) => {
  return <ImagePreviewBase {...rest} cssprop={styles.profile} />;
};
