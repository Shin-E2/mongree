"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import styles from "./styles.module.css";

interface GenerateReportButtonProps {
  month: string;
  hasSavedReport: boolean;
  canGenerate: boolean;
  isPro: boolean;
}

export function GenerateReportButton({
  month,
  hasSavedReport,
  canGenerate,
  isPro,
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

  if (hasSavedReport) {
    return (
      <div className={styles.generateControl}>
        <span className={styles.savedReportBadge}>이번 달 리포트 저장됨</span>
      </div>
    );
  }

  if (!canGenerate) {
    return (
      <div className={styles.generateControl}>
        <p className={styles.trialExhaustedNote}>
          {isPro
            ? "이번 달 AI 리포트 생성 횟수를 모두 사용했습니다."
            : "이번 달 무료 AI 리포트 1회를 사용했습니다. Pro에서 월 5회 이용 가능합니다."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.generateControl}>
      {!isPro && (
        <p className={styles.trialBadge}>
          AI 리포트 무료 체험 1회 사용 가능
        </p>
      )}
      <label className={styles.consentLabel}>
        <input
          type="checkbox"
          checked={agreed}
          disabled={isPending}
          onChange={(event) => setAgreed(event.target.checked)}
        />
        일기 내용이 외부 AI API로 전송될 수 있음에 동의합니다.
      </label>
      <button
        type="button"
        className={styles.primaryActionButton}
        onClick={handleGenerate}
        disabled={!agreed || isPending}
      >
        {isPending ? "생성 중" : isPro ? "AI 리포트 생성" : "무료 체험 시작"}
      </button>
      {message && (
        <p role="alert" className={styles.actionMessage}>
          {message}
        </p>
      )}
    </div>
  );
}
