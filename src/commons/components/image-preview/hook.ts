"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";

const PROFILE_IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export default function useProfileImagePreview() {
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { setValue, register } = useFormContext();

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";

      if (files.length === 0) return;

      const file = files[0];
      if (!PROFILE_IMAGE_ACCEPTED_TYPES.includes(file.type)) {
        alert("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setSelectedImage(file);
      setPreview(previewUrl);
      setValue("profileImage", file, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleDeleteImage = useCallback(
    () => (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      setSelectedImage(null);
      setPreview(DEFAULT_PROFILE_IMAGE);
      setValue("profileImage", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  return {
    preview,
    selectedImage,
    handleDeleteImage,
    register,
    handleFileChange,
  };
}
