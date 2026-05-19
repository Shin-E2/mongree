"use client";

import { Download, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { AiGeneratedReport } from "@/lib/ai-report/core";
import styles from "./styles.module.css";

interface ReportActionsProps {
  month: string;
  monthLabel: string;
  report: AiGeneratedReport;
}

function buildShareText(monthLabel: string, report: AiGeneratedReport) {
  const emotions =
    report.dominantEmotions.length > 0
      ? `\n주요 감정: ${report.dominantEmotions.join(", ")}`
      : "";

  return `[Mongree ${monthLabel}]\n${report.summary}\n${report.gentleInsight}${emotions}`;
}

function buildExportPayload(month: string, monthLabel: string, report: AiGeneratedReport) {
  return {
    service: "Mongree",
    type: "ai-emotion-report-summary",
    month,
    monthLabel,
    exportedAt: new Date().toISOString(),
    privacy: "일기 원문 제외 요약",
    report,
  };
}

export function ReportActions({ month, monthLabel, report }: ReportActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const shareText = useMemo(() => buildShareText(monthLabel, report), [monthLabel, report]);

  const handleCopyShare = async () => {
    setMessage(null);
    try {
      await navigator.clipboard.writeText(shareText);
      setMessage("공유용 요약을 복사했습니다.");
    } catch {
      setMessage("복사 권한을 확인한 뒤 다시 시도해주세요.");
    }
  };

  const handleExport = () => {
    const payload = buildExportPayload(month, monthLabel, report);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mongree-ai-report-${month}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("원문 제외 리포트 파일을 준비했습니다.");
  };

  const handleDelete = () => {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch(`/api/ai/reports?month=${month}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "리포트를 삭제하지 못했습니다.");
        return;
      }

      setMessage(payload.message ?? "리포트를 삭제했습니다.");
      router.refresh();
    });
  };

  return (
    <div className={styles.reportActions}>
      <button type="button" className={styles.secondaryActionButton} onClick={handleCopyShare}>
        <Share2 className={styles.actionIcon} />
        공유 요약 복사
      </button>
      <button type="button" className={styles.secondaryActionButton} onClick={handleExport}>
        <Download className={styles.actionIcon} />
        JSON 내보내기
      </button>
      <button
        type="button"
        className={styles.dangerActionButton}
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className={styles.actionIcon} />
        {isPending ? "삭제 중" : "리포트 삭제"}
      </button>
      {message && (
        <p role="status" className={styles.actionMessage}>
          {message}
        </p>
      )}
    </div>
  );
}
