"use client";

import { useState, useCallback } from "react";
import { ModalType } from "@/commons/components/modal/types";

interface SmartModalState {
  type: ModalType | null;
  isOpen: boolean;
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onConfirm?: () => void;
}

const CLOSED_STATE: SmartModalState = {
  type: null,
  isOpen: false,
  message: "",
};

export function useSmartModal() {
  const [modalState, setModalState] = useState<SmartModalState>(CLOSED_STATE);

  const showModal = useCallback(
    (
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
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false, type: null }));
  }, []);

  return { modalState, showModal, closeModal };
}
