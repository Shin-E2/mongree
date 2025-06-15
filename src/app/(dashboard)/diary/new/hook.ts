"use client";

import { useState, useCallback, useMemo } from "react";
import { DIARY_NEW_STEPS } from "../../../../components/home/(dashboard)/diary/new/constants";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";
import { createDiary } from "./action";
import { URL } from "@/commons/constants/global-url";
import { useRouter } from "next/navigation";
import { ModalType } from "@/commons/components/modal/types";

// 모달 상태 타입
interface ModalState {
  type: ModalType | null;
  isOpen: boolean;
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onConfirm?: () => void;
}

export default function useDiaryNewPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    message: '',
  });
  const router = useRouter();

  // 메모이제이션된 값들
  const currentStepData = useMemo(() => DIARY_NEW_STEPS[currentStep], [currentStep]);
  const progress = useMemo(() => ((currentStep + 1) / DIARY_NEW_STEPS.length) * 100, [currentStep]);
  const isLastStep = useMemo(() => currentStep === DIARY_NEW_STEPS.length - 1, [currentStep]);
  const DiaryNewStepComponent = useMemo(() => currentStepData.Component, [currentStepData]);

  // 네비게이션 함수들
  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, DIARY_NEW_STEPS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // 모달 표시 함수들
  const showModal = useCallback((
    type: ModalType,
    message: string,
    options?: {
      title?: string;
      details?: string;
      onRetry?: () => void;
      onConfirm?: () => void;
    }
  ) => {
    setModalState({
      type,
      isOpen: true,
      message,
      title: options?.title,
      details: options?.details,
      onRetry: options?.onRetry,
      onConfirm: options?.onConfirm,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false, type: null }));
  }, []);

  // FormData 생성 함수
  const createFormData = useCallback((data: DiaryNewFormType): FormData => {
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

    if (data.images?.length) {
      data.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });
    }

    return formData;
  }, []);

  const submitDiary = useCallback(async (data: DiaryNewFormType) => {
    setIsSubmitting(true);

    try {
      const formData = createFormData(data);
      const result = await createDiary(formData);

      if (result.success && result.diary) {
        // 성공 모달 표시 후 페이지 이동
        showModal(ModalType.SUCCESS, "일기가 성공적으로 저장되었습니다! 🎉", {
          onConfirm: () => {
            closeModal();
            router.push(URL().DIARY_DETAIL(result.diary.id));
          }
        });
      } else {
        // 에러 타입에 따른 다른 모달 표시
        const isNetworkError = result.error?.includes('네트워크') ||
                              result.error?.includes('서버') ||
                              result.error?.includes('연결');

        const modalDetails = result.details;

        showModal(
          isNetworkError ? ModalType.ERROR_CRITICAL : ModalType.ERROR_WARNING,
          result.error || "일기 저장에 실패했습니다",
          {
            details: modalDetails, // 포맷된 값을 전달
            onRetry: () => {
              closeModal();
              submitDiary(data);
            }
          }
        );
      }
    } catch (error) {
      console.error("일기 저장 중 오류:", error);

      // error 객체가 Error 인스턴스인 경우 message를 사용하고, 그렇지 않으면 문자열로 변환
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      const modalDetails = undefined;

      showModal(ModalType.ERROR_CRITICAL, "일기 저장 중 예상치 못한 오류가 발생했습니다.", {
        details: modalDetails || errorMessage, 
        onRetry: () => {
          closeModal();
          submitDiary(data);
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [router, createFormData, showModal, closeModal]);

  // 폼 제출 처리
  const onSubmit = useCallback(async (data: DiaryNewFormType) => {
    if (isSubmitting) return;
    await submitDiary(data);
  }, [isSubmitting, submitDiary]);

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
