"use client";

import { useState } from "react";
import { DEFAULT_PROFILE_IMAGE } from "./constants";
import { useFormContext } from "react-hook-form";

export default function useImagePreview() {
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE); // 이미지 미리보기 url
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택한 이미지
  // const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // 업로드 된 이미지 URL을 저장

  const { setValue, register } = useFormContext();

  // 파일 선택하기 -> 여기서 미리보기 url만 설정
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // 선택된 파일 가져오기
    if (!file) return;

    console.log("선택한 사진: ", file);
    setSelectedImage(file); // 선택한 이미지 있음

    // 미리보기 URL
    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    // 일단 임시로 file 객체 저장 -> 추후 이미지 업로드하면서 url로 다시 저장할 것!
    setValue("profileImage", file); // setValue에는 file객체로 보내야한다
    console.log("미리보기 url", previewUrl);
  };

  // 이미지 삭제
  const handleDeleteImage = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault(); // 파일 선택 창 열기 방지

    setSelectedImage(null); // 선택된 이미지 없애기
    setPreview(DEFAULT_PROFILE_IMAGE); // 미리보기 기본 이미지로 변경
    setValue("profileImage", "");
  };

  return {
    preview,
    selectedImage,
    handleDeleteImage,
    register,
    handleFileChange,
  };
}
