"use client";

import { useId } from "react";
import styles from "./styles.module.css";

interface MongiFigureProps {
  className?: string;
}

export default function MongiFigure({ className }: MongiFigureProps) {
  const gradientId = useId();
  const bodyGradientId = `${gradientId}-body`;
  const shadowGradientId = `${gradientId}-shadow`;

  return (
    <svg
      className={`${styles.figure} ${className ?? ""}`}
      viewBox="0 0 180 160"
      role="img"
      aria-label="몽이"
      focusable="false"
    >
      <defs>
        <linearGradient id={bodyGradientId} x1="28" y1="24" x2="150" y2="142">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="52%" stopColor="#f5d7c4" />
          <stop offset="100%" stopColor="#d9e6ff" />
        </linearGradient>
        <linearGradient id={shadowGradientId} x1="40" y1="120" x2="140" y2="150">
          <stop offset="0%" stopColor="#c7b7a6" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#8fa1c4" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <ellipse cx="92" cy="140" rx="56" ry="12" fill={`url(#${shadowGradientId})`} />
      <path
        className={styles.body}
        d="M42 78C42 47 64 27 94 27c29 0 52 20 52 51 0 35-24 58-54 58-31 0-50-24-50-58Z"
        fill={`url(#${bodyGradientId})`}
      />
      <path
        d="M58 57c7-19 23-28 42-26 15 1 28 9 36 24"
        fill="none"
        stroke="#fffaf4"
        strokeLinecap="round"
        strokeWidth="8"
        opacity="0.55"
      />
      <circle cx="75" cy="78" r="5" fill="#4b5563" />
      <circle cx="110" cy="78" r="5" fill="#4b5563" />
      <path
        d="M84 94c6 5 16 5 22 0"
        fill="none"
        stroke="#6b7280"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        className={styles.cheek}
        d="M55 91c7-5 15-5 20 0"
        fill="none"
        stroke="#f0a5a5"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.55"
      />
      <path
        className={styles.cheek}
        d="M118 91c7-5 15-5 20 0"
        fill="none"
        stroke="#f0a5a5"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.55"
      />
      <circle className={styles.spark} cx="135" cy="38" r="4" fill="#f6c76f" />
      <circle className={styles.spark} cx="45" cy="42" r="3" fill="#9cc5ff" />
    </svg>
  );
}
