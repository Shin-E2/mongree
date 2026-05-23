"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NotebookPen, Share2 } from "lucide-react";
import { MongiStage } from "@/components/mongi/mongi-stage";
import type { MongiState } from "@/components/mongi/mongi-stage";
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
  const [mongiState, setMongiState] = useState<MongiState>("idle");
  const [profile, setProfile] = useState<MongiProfile | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // 드래그 360도 회전 상태
  const [rotateY, setRotateY] = useState(0);
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);
  const tapCooldown = useRef(false);

  useEffect(() => {
    fetch("/api/mongi/profile")
      .then((r) => r.json())
      .then((data: MongiProfile) => setProfile(data))
      .catch(() => {});
  }, []);

  // ── 탭 반응 ──────────────────────────────────
  const handleTap = useCallback(() => {
    if (tapCooldown.current) return;
    tapCooldown.current = true;
    setMongiState("greeting");
    setTimeout(() => {
      tapCooldown.current = false;
    }, 700);
  }, []);

  // ── 드래그 회전 ──────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.startX = e.clientX;
    setRotateY((prev) => prev + dx * 0.6);
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleEquipped = useCallback((slots: MongiEquippedSlots) => {
    setProfile((prev) => prev ? { ...prev, equippedSlots: slots } : prev);
    setMongiState("equip");
  }, []);

  const handleShare = async () => {
    if (!profile) return;
    const params = new URLSearchParams({
      nickname: profile.nickname ?? "몽이",
      level: String(profile.level),
      streak: String(profile.streakDays),
    });
    const url = `${window.location.origin}/api/og/mongi?${params.toString()}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile.nickname ?? ""}의 몽이`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("카드 링크를 복사했습니다.");
        setTimeout(() => setShareMessage(null), 2500);
      }
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

        {/* 드래그로 회전 + 탭 */}
        <div
          className={styles.characterStage}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleTap}
          role="button"
          tabIndex={0}
          aria-label="몽이를 드래그하거나 탭해보세요"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleTap(); }}
        >
          <div
            className={styles.characterRotate}
            style={{ transform: `rotateY(${rotateY}deg)` }}
          >
            <MongiStage
              state={mongiState}
              onStateEnd={() => setMongiState("idle")}
              size={240}
              level={profile?.level}
              streakDays={profile?.streakDays}
              equippedSlots={profile?.equippedSlots}
            />
          </div>
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
