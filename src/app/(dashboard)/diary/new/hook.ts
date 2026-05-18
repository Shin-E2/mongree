"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DIARY_NEW_STEPS } from "../../../../components/home/(dashboard)/diary/new/constants";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";
import { createDiary } from "./action";
import { URL } from "@/commons/constants/global-url";
import { ModalType } from "@/commons/components/modal/types";
import { useSmartModal } from "@/commons/hooks/use-smart-modal";

function createDiaryFormData(data: DiaryNewFormType): FormData {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("isPrivate", String(data.isPrivate));

  data.emotions.forEach((emotion) => {
    formData.append("emotions", emotion);
  });

  if (data.tags?.length) {
    formData.append("tags", data.tags.join(","));
  }

  data.images?.forEach((image) => {
    if (image instanceof File) {
      formData.append("images", image);
    }
  });

  return formData;
}

function isCriticalSaveError(message?: string) {
  if (!message) return false;
  return ["네트워크", "서버", "연결", "업로드"].some((keyword) =>
    message.includes(keyword)
  );
}

export default function useDiaryNewPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { modalState, showModal, closeModal } = useSmartModal();
  const router = useRouter();

  const currentStepData = useMemo(
    () => DIARY_NEW_STEPS[currentStep],
    [currentStep]
  );
  const progress = useMemo(
    () => ((currentStep + 1) / DIARY_NEW_STEPS.length) * 100,
    [currentStep]
  );
  const isLastStep = useMemo(
    () => currentStep === DIARY_NEW_STEPS.length - 1,
    [currentStep]
  );
  const DiaryNewStepComponent = useMemo(
    () => currentStepData.Component,
    [currentStepData]
  );

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, DIARY_NEW_STEPS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const submitDiary = useCallback(
    async (data: DiaryNewFormType) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
        const result = await createDiary(createDiaryFormData(data));

        if (result.success && result.diary) {
          router.push(URL().DIARY_DETAIL(result.diary.id));
          router.refresh();
          return;
        }

        const message = result.error || "일기 저장에 실패했습니다.";
        showModal(
          isCriticalSaveError(message)
            ? ModalType.ERROR_CRITICAL
            : ModalType.ERROR_WARNING,
          message,
          {
            details: result.details,
            onRetry: () => {
              closeModal();
              void submitDiary(data);
            },
          }
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "일기 저장 중 예상하지 못한 오류가 발생했습니다.";

        showModal(ModalType.ERROR_CRITICAL, message, {
          details: "잠시 후 다시 시도해주세요.",
          onRetry: () => {
            closeModal();
            void submitDiary(data);
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeModal, isSubmitting, router, showModal]
  );

  const onSubmit = useCallback(
    async (data: DiaryNewFormType) => {
      await submitDiary(data);
    },
    [submitDiary]
  );

  return {
    currentStep,
    progress,
    isLastStep,
    isSubmitting,
    modalState,
    handleNext,
    handlePrev,
    DiaryNewStepComponent,
    onSubmit,
    closeModal,
  };
}
