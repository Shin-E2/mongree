"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { MongiStage } from "@/components/mongi/mongi-stage";
import type { MongiState } from "@/components/mongi/mongi-stage";
import MongiInventoryClient from "../profile/mongi-inventory-client";
import styles from "./styles.module.css";

interface MongiProfile {
  level: number;
  streakDays: number;
  cloudPoints: number;
  experience: number;
  nickname: string | null;
}

export default function MongiPage() {
  const [mongiState, setMongiState] = useState<MongiState>("idle");
  const [profile, setProfile] = useState<MongiProfile | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mongi/profile")
      .then((r) => r.json())
      .then((data: MongiProfile) => setProfile(data))
      .catch(() => {});
  }, []);

  const handleEquipped = useCallback(() => {
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

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <span className={styles.badge}>몽이 꾸미기</span>
          <h1 className={styles.heroTitle}>오늘의 몽이를 골라주세요</h1>
          <p className={styles.heroDescription}>
            일기를 쓰며 모은 아이템으로 몽이의 분위기를 바꿉니다. 아직은 기본
            아이템부터 시작하고, 이후 보상과 이벤트로 확장합니다.
          </p>

          {profile && (
            <div className={styles.statRow}>
              <span className={styles.statBadge}>Lv.{profile.level}</span>
              {profile.streakDays >= 1 && (
                <span className={styles.statBadge}>{profile.streakDays}일 연속</span>
              )}
              <span className={styles.statBadge}>☁ {profile.cloudPoints.toLocaleString()}</span>
            </div>
          )}

          <div className={styles.actionRow}>
            <Link href="/home" className={styles.secondaryLink}>
              홈으로 돌아가기
            </Link>
            <button
              type="button"
              className={styles.shareButton}
              onClick={handleShare}
              disabled={!profile}
            >
              <Share2 size={14} aria-hidden="true" />
              몽이 공유
            </button>
          </div>
          {shareMessage && (
            <p role="status" className={styles.shareMessage}>{shareMessage}</p>
          )}
        </div>
        <div className={styles.figureStage} aria-hidden="true">
          <MongiStage
            state={mongiState}
            onStateEnd={() => setMongiState("idle")}
            size={200}
            level={profile?.level}
            streakDays={profile?.streakDays}
          />
        </div>
      </section>

      <MongiInventoryClient onEquipped={handleEquipped} />
    </div>
  );
}
