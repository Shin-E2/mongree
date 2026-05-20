"use client";

import DiaryFeedCard from "@/commons/components/diary-feed-card";
import { EMOTIONS } from "@/mock/emotions";
import styles from "./styles.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EMOTION_STYLES } from "@/commons/constants/emotion-styles";
import type { Diary } from "@/app/(dashboard)/diary/types";

interface DiaryListDiaryCardProps {
  diary: Diary;
  router: AppRouterInstance;
  onClick: () => void;
}

export function DiaryListDiaryCard({
  diary,
  onClick,
}: DiaryListDiaryCardProps) {
  const emotionsForBadgeList = (diary.diaryEmotion ?? []).map(({ emotion }) => {
    const emotionStyle =
      EMOTION_STYLES[emotion.id as keyof typeof EMOTION_STYLES];
    return {
      id: emotion.id,
      label: emotion.label,
      image: EMOTIONS.find((e) => e.id === emotion.id)?.image || "",
      bgColor: emotionStyle?.bgColor || "bg-gray-100",
      borderColor: emotionStyle?.borderColor || "border-gray-400",
      textColor: emotionStyle?.textColor || "text-gray-800",
    };
  });

  return (
    <DiaryFeedCard
      title={diary.title}
      content={diary.content}
      ariaLabel="일기 상세 보기"
      onClick={onClick}
      profile={{
        profileImage: null,
        displayName: diary.isPrivate ? "비공개 일기" : "공개 일기",
        createdAt: diary.createdAt
          ? new Date(diary.createdAt).toISOString()
          : null,
      }}
      emotions={emotionsForBadgeList}
      images={(diary.images ?? []).map((image) => ({
        id: image.id,
        url: image.url,
      }))}
      tags={(diary.tags ?? []).map(({ tag }) => tag)}
      footer={
        <div className={styles.privacy}>
          <span
            className={`${styles.privacyDot} ${
              diary.isPrivate ? styles.privacyDotRed : styles.privacyDotGreen
            }`}
          />
          {diary.isPrivate ? "비공개" : "공개"}
        </div>
      }
    />
  );
}
