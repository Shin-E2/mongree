"use client";

import { useState } from "react";

export default function useModal() {
  // 모달
  const [isOpen, setIsOpen] = useState(false);

  const handleModalClose = () => {
    setIsOpen(false);
  };
  return {
    handleModalClose,
    isOpen,
    setIsOpen,
  };
}
