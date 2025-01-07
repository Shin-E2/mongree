import Image from "next/image";
import { ButtonIconDelete } from "../button-icon";
import styles from "./styles.module.css";
import type {
  IImagePreviewBaseProps,
  IImagePreviewByProfileProps,
} from "./types";
import { useRef } from "react";

// 이미지 미리보기 컴포넌트
export default function ImagePreviewBase({
  cssprop,
  src,
  showDeleteIcon = false,
}: IImagePreviewBaseProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  // 이미지 영역 클릭 시 파일 선택
  const handleImageClick = () => {
    fileRef.current?.click();
  };

  // 이미지 삭제
  const handleDeleteImage = async (e: React.MouseEvent) => {
    e.stopPropagation();

    /* 
     try {
      // 기본 이미지로 리셋
      const response = await fetch(DEFAULT_PROFILE_IMAGE);
      const blob = await response.blob();
      const defaultImageFile = new File([blob], "defaultProfile.png", {
        type: "image/png",
      });

      setSelectedImage(null);
      setPreviewUrl(DEFAULT_PROFILE_IMAGE);
      setValue("image", defaultImageFile, {
        shouldValidate: true,
      });

      // 파일 초기화
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      console.error("기본 이미지 초기화 오류:", error);
    } 
      */
  };

  return (
    <div className={`${cssprop} ${styles.common}`} onClick={handleImageClick}>
      <Image src={src} alt="Profile Preview" layout="fill" objectFit="cover" />

      {/* 삭제 아이콘 오버레이 */}
      {showDeleteIcon && <ButtonIconDelete onClick={handleDeleteImage} />}
    </div>
  );
}

// 프로필 이미지 미리보기 컴포넌트
export const ImagePreviewByProfile = ({
  ...rest
}: IImagePreviewByProfileProps) => {
  return <ImagePreviewBase {...rest} cssprop={styles.profile} />;
};
