"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface ImageFile {
  file: File;
  previewURL: string;
}

export default function useImagePreview({ multiple = false, maxImages = 1 }) {
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE); // 이미지 미리보기 url
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택한 이미지
  const [images, setImages] = useState<ImageFile[]>([]);

  const { setValue, register } = useFormContext();

  // 파일 선택하기 -> 여기서 미리보기 url만 설정
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files; // 선택된 파일 가져오기
    console.log("선택한 사진: ", files);

    if (!files) return;

    if (multiple) {
      const newImages = Array.from(files).map((file) => ({
        file,
        previewURL: URL.createObjectURL(file),
      }));

      if (images.length + newImages.length > maxImages) {
        alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      setImages((prev) => [...prev, ...newImages]);
      setValue(
        "images",
        [...images, ...newImages].map((img) => img.file)
      );
    } else {
      const file = files[0];

      // 미리보기 URL
      const previewUrl = URL.createObjectURL(file);

      setSelectedImage(file); // 선택한 이미지 있음
      setPreview(previewUrl);

      // 일단 임시로 file 객체 저장 -> 추후 이미지 업로드하면서 url로 다시 저장할 것!
      setValue("profileImage", file); // setValue에는 file객체로 보내야한다
      console.log("미리보기 url", previewUrl);
    }
  };

  // 이미지 삭제
  const handleDeleteImage = (index?: number) => (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault(); // 파일 선택 창 열기 방지

    if (multiple && typeof index === "number") {
      setImages((prev) => {
        const newImages = [...prev];
        URL.revokeObjectURL(newImages[index].previewURL);
        newImages.splice(index, 1);
        setValue(
          "images",
          newImages.map((img) => img.file)
        );
        return newImages;
      });
    } else {
      setSelectedImage(null); // 선택된 이미지 없애기
      setPreview(DEFAULT_PROFILE_IMAGE); // 미리보기 기본 이미지로 변경
      setValue("profileImage", "");
    }
  };

  return {
    preview,
    selectedImage,
    images,
    handleDeleteImage,
    register,
    handleFileChange,
  };
}
