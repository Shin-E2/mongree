"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import styles from "./styles.module.css";

interface GenerateReportButtonProps {
  month: string;
  hasSavedReport: boolean;
}

export function GenerateReportButton({
  month,
  hasSavedReport,
}: GenerateReportButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleGenerate = () => {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch("/api/ai/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, explicitConsent: true }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "AI 리포트 생성에 실패했습니다.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className={styles.generateControl}>
      <label className={styles.consentLabel}>
        <input
          type="checkbox"
          checked={agreed}
          disabled={hasSavedReport || isPending}
          onChange={(event) => setAgreed(event.target.checked)}
        />
        일기 내용이 외부 AI API로 전송될 수 있음에 동의합니다.
      </label>
      <button
        type="button"
        className={styles.primaryActionButton}
        onClick={handleGenerate}
        disabled={!agreed || isPending || hasSavedReport}
      >
        {hasSavedReport ? "저장된 리포트" : isPending ? "생성 중" : "AI 리포트 생성"}
      </button>
      {message && (
        <p role="alert" className={styles.actionMessage}>
          {message}
        </p>
      )}
    </div>
  );
}
