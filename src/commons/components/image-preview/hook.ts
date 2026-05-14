"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  DIARY_IMAGE_ACCEPTED_TYPES,
  DIARY_IMAGE_MAX_COUNT,
} from "@/components/home/(dashboard)/diary/new/form.schema";

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
  maxImages = DIARY_IMAGE_MAX_COUNT,
}: UseImagePreviewProps) {
  const [preview, setPreview] = useState(DEFAULT_PROFILE_IMAGE);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const imagesRef = useRef<ImageFile[]>([]);

  const { setValue, register } = useFormContext();

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewURL));
    };
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";

      if (files.length === 0) return;

      const invalidType = files.some(
        (file) => !DIARY_IMAGE_ACCEPTED_TYPES.includes(file.type)
      );
      if (invalidType) {
        alert("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
        return;
      }

      if (multiple) {
        if (images.length + files.length > maxImages) {
          alert(`이미지는 최대 ${maxImages}개까지 등록할 수 있습니다.`);
          return;
        }

        const nextImages = [
          ...images,
          ...files.map((file) => ({
            file,
            previewURL: URL.createObjectURL(file),
          })),
        ];

        setImages(nextImages);
        setValue(
          "images",
          nextImages.map((image) => image.file),
          { shouldDirty: true, shouldValidate: true }
        );
        return;
      }

      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      setSelectedImage(file);
      setPreview(previewUrl);
      setValue("profileImage", file, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [images, maxImages, multiple, setValue]
  );

  const handleDeleteImage = useCallback(
    (index?: number) => (event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (multiple && typeof index === "number") {
        setImages((prev) => {
          const nextImages = [...prev];
          URL.revokeObjectURL(nextImages[index].previewURL);
          nextImages.splice(index, 1);

          setValue(
            "images",
            nextImages.map((image) => image.file),
            { shouldDirty: true, shouldValidate: true }
          );

          return nextImages;
        });
        return;
      }

      setSelectedImage(null);
      setPreview(DEFAULT_PROFILE_IMAGE);
      setValue("profileImage", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
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
