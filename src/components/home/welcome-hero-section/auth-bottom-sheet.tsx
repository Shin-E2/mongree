"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

interface Props {
  onClose: () => void;
}

export default function AuthBottomSheet({ onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = panel.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <>
      <div
        className={styles.sheetDim}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={styles.sheetPanel}
        role="dialog"
        aria-modal="true"
        aria-label="시작하기"
        tabIndex={-1}
      >
        <div className={styles.sheetHandle} aria-hidden="true" />
        <svg viewBox="0 0 56 56" width="48" height="48" className={styles.sheetMongi} aria-hidden="true" focusable="false">
          <ellipse cx="28" cy="36" rx="16" ry="17" fill="#fff8f0" />
          <ellipse cx="18" cy="20" rx="7" ry="9" fill="#f59c42" transform="rotate(-15 18 20)" />
          <ellipse cx="38" cy="20" rx="7" ry="9" fill="#f59c42" transform="rotate(15 38 20)" />
          <ellipse cx="28" cy="25" rx="15" ry="13" fill="#fff8f0" />
          <ellipse cx="20" cy="28" rx="5" ry="3.5" fill="#f0a5a5" opacity="0.55" />
          <ellipse cx="36" cy="28" rx="5" ry="3.5" fill="#f0a5a5" opacity="0.55" />
          <path d="M 22 25 Q 24 23 26 25" stroke="#2d2d3a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 30 25 Q 32 23 34 25" stroke="#2d2d3a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 22 31 Q 28 36 34 31" stroke="#c87028" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
        <p className={styles.sheetLogo}>mongree</p>
        <p className={styles.sheetSub}>
          오늘의 감정을 기록하고<br />몽이와 함께 성장해요 🌱
        </p>
        <Link href="/signup" className={styles.sheetBtnPrimary}>
          시작하기 (무료)
        </Link>
        <Link href="/login" className={styles.sheetBtnSecondary}>
          로그인
        </Link>
        <Link href="/dashboard" className={styles.sheetSkip}>
          지금은 둘러만 볼게요
        </Link>
      </div>
    </>
  );
}
