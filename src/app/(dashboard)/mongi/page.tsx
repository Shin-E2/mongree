"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen, Share2 } from "lucide-react";
import Mongi3D from "@/components/mongi/mongi-3d";
import type { MongiEquippedSlots } from "@/components/theme/mongi-figure";
import MongiInventoryClient from "../profile/mongi-inventory-client";
import styles from "./styles.module.css";

interface MongiProfile {
  level: number;
  streakDays: number;
  cloudPoints: number;
  experience: number;
  nickname: string | null;
  equippedSlots: MongiEquippedSlots;
}

function xpForNextLevel(level: number) {
  return level * 100;
}

function greetingByStreak(streak: number, nickname: string | null): string {
  const name = nickname ?? "주인님";
  if (streak === 0) return `${name}, 오늘 첫 일기를 써볼까요?`;
  if (streak === 1) return "어제도 왔군요. 오늘도 이야기해줘요.";
  if (streak < 7) return `${streak}일째 함께하고 있어요.`;
  if (streak < 30) return `${streak}일 연속! 정말 대단해요.`;
  return `${streak}일째 함께해줘서 고마워요.`;
}

export default function MongiPage() {
  const [profile, setProfile] = useState<MongiProfile | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mongi/profile")
      .then((r) => r.json())
      .then((data: MongiProfile) => setProfile(data))
      .catch(() => {});
  }, []);

  const handleEquipped = useCallback((slots: MongiEquippedSlots) => {
    setProfile((prev) => (prev ? { ...prev, equippedSlots: slots } : prev));
  }, []);

  const handleShare = async () => {
    if (!profile) return;
    const hour = new Date().getHours();
    const expression = hour < 7 || hour >= 23 ? "sleepy" : "happy";
    const params = new URLSearchParams({
      nickname: profile.nickname ?? "몽이",
      level: String(profile.level),
      streak: String(profile.streakDays),
      expression,
    });
    const url = `${window.location.origin}/api/og/mongi?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("카드 생성 실패");
      const blob = await response.blob();
      const file = new File([blob], "my-mongi.png", { type: "image/png" });

      // 이미지 파일 직접 공유 지원 시 (주로 모바일) → 인스타 등으로 바로
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${profile.nickname ?? "나"}의 몽이`,
        });
        return;
      }

      // 아니면 PNG로 저장 (스냅샷 다운로드)
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "my-mongi.png";
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      setShareMessage("몽이 스냅샷을 저장했습니다.");
      setTimeout(() => setShareMessage(null), 2500);
    } catch {
      setShareMessage("공유에 실패했습니다.");
      setTimeout(() => setShareMessage(null), 2500);
    }
  };

  const xpMax = xpForNextLevel(profile?.level ?? 1);
  const xpCurrent = profile?.experience ?? 0;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpMax) * 100));
  const greeting = greetingByStreak(profile?.streakDays ?? 0, profile?.nickname ?? null);

  return (
    <div className={styles.pageContainer}>
      <section className={styles.characterCard}>
        <div className={styles.levelBar}>
          <span className={styles.levelLabel}>Lv.{profile?.level ?? 1}</span>
          <div
            className={styles.xpTrack}
            role="progressbar"
            aria-valuenow={xpPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`경험치 ${xpPercent}%`}
          >
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <span className={styles.xpText}>{xpCurrent}/{xpMax}</span>
        </div>

        {/* 드래그로 360도 회전 + 탭하면 좋아함 */}
        <div className={styles.characterStage}>
          <Mongi3D />
        </div>

        <p className={styles.greeting}>{greeting}</p>

        <div className={styles.statsRow}>
          {(profile?.streakDays ?? 0) >= 1 && (
            <span className={styles.statChip}>
              <span className={styles.statIcon} aria-hidden="true">🔥</span>
              {profile?.streakDays}일 연속
            </span>
          )}
          <span className={styles.statChip}>
            <span className={styles.statIcon} aria-hidden="true">☁</span>
            {(profile?.cloudPoints ?? 0).toLocaleString()} 포인트
          </span>
        </div>

        <div className={styles.actionsRow}>
          <Link href="/diary/new" className={styles.primaryAction}>
            <NotebookPen size={15} aria-hidden="true" />
            오늘 일기 쓰기
          </Link>
          <button
            type="button"
            className={styles.shareAction}
            onClick={handleShare}
            disabled={!profile}
            aria-label="몽이 카드 공유"
          >
            <Share2 size={14} aria-hidden="true" />
            공유
          </button>
        </div>

        {shareMessage && (
          <p role="status" className={styles.shareMessage}>{shareMessage}</p>
        )}
      </section>

      <MongiInventoryClient
        onEquipped={handleEquipped}
        currentEquippedSlots={profile?.equippedSlots}
      />
    </div>
  );
}
