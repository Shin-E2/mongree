"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { DiaryEditData } from "@/app/(dashboard)/diary/[id]/edit/action";
import { updateDiary } from "@/app/(dashboard)/diary/[id]/edit/action";
import { useImageUpload } from "@/commons/hooks/use-image-upload";
import { useSmartModal } from "@/commons/hooks/use-smart-modal";
import { ModalType } from "@/commons/components/modal/types";
import {
  DiaryNewFormSchema,
  type DiaryNewFormType,
} from "@/components/home/(dashboard)/diary/new/form.schema";

interface UseDiaryEditFormParams {
  diary: DiaryEditData;
}

const appendDiaryFormData = (
  formData: FormData,
  data: DiaryNewFormType,
  imageState: ReturnType<typeof useImageUpload>
) => {
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("isPrivate", String(data.isPrivate));
  data.emotions.forEach((emotionId) => formData.append("emotions", emotionId));
  formData.append("tags", data.tags?.join(",") ?? "");

  imageState.existingImages.forEach((image) =>
    formData.append("keptImageIds", image.id)
  );
  imageState.removedImageIds.forEach((imageId) =>
    formData.append("removedImageIds", imageId)
  );
  imageState.newImages.forEach((image) =>
    formData.append("images", image.file)
  );
};

export function useDiaryEditForm({ diary }: UseDiaryEditFormParams) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { modalState, showModal, closeModal } = useSmartModal();
  const imageState = useImageUpload({ initialImages: diary.images });

  const form = useForm<DiaryNewFormType>({
    resolver: zodResolver(DiaryNewFormSchema),
    mode: "onChange",
    defaultValues: {
      isPrivate: diary.isPrivate,
      emotions: diary.emotions,
      title: diary.title,
      content: diary.content,
      tags: diary.tags,
      images: [],
    },
  });

  const selectedEmotions = form.watch("emotions") ?? [];
  const isPrivate = form.watch("isPrivate");
  const titleLength = form.watch("title")?.length ?? 0;
  const contentLength = form.watch("content")?.length ?? 0;
  const tagInputValue = useMemo(() => diary.tags.join(", "), [diary.tags]);

  const handleBack = () => router.back();

  const setPrivacy = (nextValue: boolean) => {
    form.setValue("isPrivate", nextValue, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const toggleEmotion = (emotionId: string) => {
    const nextEmotions = selectedEmotions.includes(emotionId)
      ? selectedEmotions.filter((id) => id !== emotionId)
      : [...selectedEmotions, emotionId];

    form.setValue("emotions", nextEmotions, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const submitDiary = (data: DiaryNewFormType) => {
    if (isPending) return;

    const formData = new FormData();
    appendDiaryFormData(formData, data, imageState);

    startTransition(async () => {
      const result = await updateDiary(diary.id, formData);

      if (result.success) {
        router.push(`/diary/${diary.id}`);
        router.refresh();
        return;
      }

      showModal(
        ModalType.ERROR_WARNING,
        result.error ?? "일기 수정에 실패했습니다.",
        { details: "내용을 확인하고 다시 시도해주세요." }
      );
    });
  };

  return {
    form,
    imageState,
    selectedEmotions,
    isPrivate,
    titleLength,
    contentLength,
    tagInputValue,
    isPending,
    modalState,
    closeModal,
    handleBack,
    setPrivacy,
    toggleEmotion,
    submitDiary,
  };
}
