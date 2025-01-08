import Image from "next/image";
import { ButtonIconDelete } from "../button-icon";
import styles from "./styles.module.css";
import type {
  IImagePreviewBaseProps,
  IImagePreviewByProfileProps,
} from "./types";
import { useRef, useState } from "react";

export const DEFAULT_PROFILE_IMAGE = `/image/default-profile.png`;

// 이미지 미리보기 컴포넌트
export default function ImagePreviewBase({ cssprop }: IImagePreviewBaseProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false); // 삭제
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_IMAGE); // 이미지 미리보기 url
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택한 이미지

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("선택한 사진: ", file);

      // Form에 파일 데이터 설정
      // setValue("image", file, {
      //   shouldValidate: true, // 유효성 검사: zod에서 설정해둠
      // });
      setSelectedImage(file);

      // FileReader를 사용하여 이미지를 data url로 변환 --> 이미지 미리보기
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.onerror = () => {
        throw new Error("이미지 파일을 읽는 중 오류가 발생했습니다.");
      };
      fileReader.readAsDataURL(file);
    } catch (error) {
      console.error("이미지 처리 중 오류:", error);
    }
  };

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
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`${cssprop} ${styles.common}`}
          onClick={handleImageClick}
        >
          <Image
            src={previewUrl}
            alt="Profile Preview"
            layout="fill"
            objectFit="cover"
          />

          {/* 삭제 아이콘 오버레이 */}
          {isHovered && selectedImage !== null && (
            <ButtonIconDelete onClick={handleDeleteImage} />
          )}
        </div>
      </div>
      {/* 숨김 파일 입력 */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}

// 프로필 이미지 미리보기 컴포넌트
export const ImagePreviewByProfile = ({
  ...rest
}: IImagePreviewByProfileProps) => {
  return <ImagePreviewBase {...rest} cssprop={styles.profile} />;
};
