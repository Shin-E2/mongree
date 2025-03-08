"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";

interface ImageFile {
  file: File;
  previewURL: string;
}

interface UseImagePreviewProps {
  multiple?: boolean;
  maxImages?: number;
}

export default function useImagePreview({
  multiple = false,
  maxImages = 1,
}: UseImagePreviewProps) {
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE); // 이미지 미리보기 url
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택한 이미지
  const [images, setImages] = useState<ImageFile[]>([]);

  const { setValue, register } = useFormContext();

  // 파일 선택하기 -> 여기서 미리보기 url만 설정
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      if (multiple) {
        // 여러 이미지 처리
        const newImages = Array.from(files).map((file) => ({
          file,
          previewURL: URL.createObjectURL(file),
        }));

        // 최대 이미지 개수 체크
        if (images.length + newImages.length > maxImages) {
          alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
          return;
        }

        // 상태 업데이트
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        // File 객체 배열을 저장
        setValue(
          "images",
          updatedImages.map((img) => img.file),
          { shouldDirty: true }
        );
      } else {
        const file = files[0];
        const previewUrl = URL.createObjectURL(file);

        setSelectedImage(file);
        setPreview(previewUrl);

        setValue("profileImage", file, { shouldDirty: true });
      }

      // 폼 입력 필드 초기화 (같은 파일 선택 시에도 이벤트가 발생하도록)
      event.target.value = "";
    },
    [images, maxImages, multiple, setValue]
  );

  // 이미지 삭제
  const handleDeleteImage = useCallback(
    (index?: number) => (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (multiple && typeof index === "number") {
        setImages((prev) => {
          const newImages = [...prev];
          // 미리보기 URL 메모리 해제
          URL.revokeObjectURL(newImages[index].previewURL);
          newImages.splice(index, 1);

          setValue(
            "images",
            newImages.map((img) => img.file),
            { shouldDirty: true }
          );

          return newImages;
        });
      } else {
        setSelectedImage(null);
        setPreview(DEFAULT_PROFILE_IMAGE);
        setValue("profileImage", "", { shouldDirty: true });
      }
    },
    [multiple, setValue]
  );

  return {
    preview,
    selectedImage,
    images,
    handleDeleteImage,
    register,
    handleFileChange,
  };
}
