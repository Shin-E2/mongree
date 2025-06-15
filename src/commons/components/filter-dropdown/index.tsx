import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

interface FilterDropdownProps {
  trigger: React.ReactNode; // 드롭다운을 열고 닫는 요소 (버튼 등)
  content: React.ReactNode; // 드롭다운이 열렸을 때 보여줄 내용 (옵션 목록 등)
  className?: string; // 컨테이너 div에 적용할 클래스
  panelClassName?: string; // 드롭다운 패널에 적용할 클래스
}

export function FilterDropdown({
  trigger,
  content,
  className,
  panelClassName,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ESC 키 입력 시 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.container} ${className}`} ref={dropdownRef}>
      {/* 트리거 요소 */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* 드롭다운 패널 */}
      {isOpen && (
        <div className={`${styles.panel} ${panelClassName}`}>{content}</div>
      )}
    </div>
  );
}
