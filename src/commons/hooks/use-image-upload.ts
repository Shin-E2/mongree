"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { DiaryEditImage } from "@/app/(dashboard)/diary/[id]/edit/action";
import { validateDiaryImages } from "@/lib/diary/image-validation";
import {
  DIARY_IMAGE_ACCEPTED_TYPES,
  DIARY_IMAGE_MAX_COUNT,
} from "@/components/home/(dashboard)/diary/new/form.schema";

interface NewImagePreview {
  file: File;
  previewUrl: string;
}

interface UseImageUploadProps {
  initialImages?: DiaryEditImage[];
}

export function useImageUpload({ initialImages = [] }: UseImageUploadProps = {}) {
  const [existingImages, setExistingImages] =
    useState<DiaryEditImage[]>(initialImages);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const [imageError, setImageError] = useState("");
  const newImagesRef = useRef<NewImagePreview[]>([]);

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.previewUrl)
      );
    };
  }, []);

  const imageCount = existingImages.length + newImages.length;

  const handleRemoveExisting = useCallback((imageId: string) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
    setRemovedImageIds((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId]
    );
    setImageError("");
  }, []);

  const handleRemoveNew = useCallback((index: number) => {
    setNewImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
    setImageError("");
  }, []);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";

      if (files.length === 0) return;

      const validationError = validateDiaryImages({
        files,
        currentCount: imageCount,
        maxCount: DIARY_IMAGE_MAX_COUNT,
        acceptedTypes: DIARY_IMAGE_ACCEPTED_TYPES,
      });

      if (validationError) {
        setImageError(validationError);
        return;
      }

      setNewImages((prev) => [
        ...prev,
        ...files.map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        })),
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
    maxCount: DIARY_IMAGE_MAX_COUNT,
    handleRemoveExisting,
    handleRemoveNew,
    handleImageChange,
  };
}
