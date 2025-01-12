import Image from "next/image";
import { ButtonIconDelete } from "../button-icon";
import styles from "./styles.module.css";
import type {
  IImagePreviewBaseProps,
  IImagePreviewByProfileProps,
} from "./types";
import { useRef, useState } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { InputStandardSFull } from "../input";

export const DEFAULT_PROFILE_IMAGE = `/image/default-profile.png`;

// 이미지 미리보기 컴포넌트
export default function ImagePreviewBase<T extends FieldValues>({
  cssprop,
}: IImagePreviewBaseProps<T>) {
  const [isHovered, setIsHovered] = useState(false); // 삭제
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE); // 이미지 미리보기 url
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // 업로드된 이미지 URL을 저장
  const [isUploading, setIsUploading] = useState(false); //이미지 업로드 상태
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택한 이미지

  const { setValue, register, watch } = useFormContext();
  console.log(watch());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일
    const file = event.target.files?.[0]; // 선택된 파일 가져오기
    if (!file) return;

    // 파일 타입 검증
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      alert("이미지 파일만 업로드 할 수 있습니다");
      return;
    }

    //파일 크기 확인(5MB)
    const fileSize = 5 * 1024 * 1024;
    if (file.size > fileSize) {
      alert("파일 크기는 5MB를 초과할 수 없습니다");
      return;
    }

    try {
      console.log("선택한 사진: ", file);
      setIsUploading(true);

      setSelectedImage(file);

      // 미리보기 URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // FileReader를 사용하여 이미지를 data url로 변환 --> 이미지 미리보기
      // const fileReader = new FileReader();
      // fileReader.onloadend = () => {
      //   setPreview(fileReader.result as string);
      // };
      // fileReader.onerror = () => {
      //   throw new Error("이미지 파일을 읽는 중 오류가 발생했습니다.");
      // };
      // fileReader.readAsDataURL(file);
      setValue("profileImage", previewUrl);
    } catch (error) {
      console.error("이미지 처리 중 오류:", error);
    }
  };

  // 이미지 삭제
  const handleDeleteImage = async (event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      // 기본 이미지로 리셋
      const response = await fetch(DEFAULT_PROFILE_IMAGE);
      const blob = await response.blob();
      const defaultImageFile = new File([blob], "defaultProfile.png", {
        type: "image/png",
      });

      setSelectedImage(null);
      setPreview(DEFAULT_PROFILE_IMAGE);
      setValue("profileImage", defaultImageFile, {
        shouldValidate: true,
      });

      // 파일 초기화
      // if (fileRef.current) {
      //   fileRef.current.value = "";
      // }
    } catch (error) {
      console.error("기본 이미지 초기화 오류:", error);
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <label
          htmlFor="photo"
          className={`${cssprop} ${styles.common}`}
          // onClick={handleImageClick}
        >
          <Image
            src={preview}
            alt="Profile Preview"
            layout="fill"
            objectFit="cover"
          />

          {/* 삭제 아이콘 오버레이 */}
          {isHovered && selectedImage !== null && (
            <ButtonIconDelete onClick={handleDeleteImage} />
          )}
        </label>
      </div>
      {/* 숨김 파일 입력 */}
      {/* <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileRef}
      /> */}
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
