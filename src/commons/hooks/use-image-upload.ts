"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { DiaryEditImage } from "@/app/(dashboard)/diary/[id]/edit/action";

interface NewImagePreview {
  file: File;
  previewUrl: string;
}

const MAX_IMAGE_COUNT = 3;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

interface UseImageUploadProps {
  initialImages?: DiaryEditImage[];
}

export function useImageUpload({ initialImages = [] }: UseImageUploadProps = {}) {
  const [existingImages, setExistingImages] = useState<DiaryEditImage[]>(initialImages);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const [imageError, setImageError] = useState("");
  const newImagesRef = useRef<NewImagePreview[]>([]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  const imageCount = existingImages.length + newImages.length;

  const handleRemoveExisting = useCallback((imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setRemovedImageIds((prev) => (prev.includes(imageId) ? prev : [...prev, imageId]));
    setImageError("");
  }, []);

  const handleRemoveNew = useCallback((index: number) => {
    setNewImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setImageError("");
  }, []);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";

      if (files.length === 0) return;

      if (imageCount + files.length > MAX_IMAGE_COUNT) {
        setImageError(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`);
        return;
      }

      const invalid = files.some((f) => !ACCEPTED_TYPES.includes(f.type));
      if (invalid) {
        setImageError("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
        return;
      }

      setNewImages((prev) => [
        ...prev,
        ...files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
      ]);
      setImageError("");
    },
    [imageCount]
  );

  return {
    existingImages,
    removedImageIds,
    newImages,
    imageCount,
    imageError,
    maxCount: MAX_IMAGE_COUNT,
    handleRemoveExisting,
    handleRemoveNew,
    handleImageChange,
  };
}
