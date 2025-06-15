"use client";

import { formatToTimeAgo } from "@/lib/utils";
import { EMOTIONS } from "@/mock/emotions";
import styles from "./styles.module.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import { EMOTION_STYLES } from "@/commons/constants/emotion-styles";
import Image from "next/image";
import type { DiaryWithRelations } from "@/components/home/(dashboard)/diary/detail/types";
import { TagList } from "@/commons/components/tag-list";
import { Database } from "@/lib/supabase.types";

type EmotionTable = Database["public"]["Tables"]["emotions"]["Row"];

interface DiaryListDiaryCardProps {
  diary: DiaryWithRelations;
  router: AppRouterInstance;
  onClick: () => void;
}

export function DiaryListDiaryCard({
  diary,
  onClick,
}: DiaryListDiaryCardProps) {
  const emotionsForBadgeList = (diary.diaryEmotion ?? []).map(
    ({ emotion }: { emotion: EmotionTable }) => {
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
    }
  );

  return (
    <div onClick={onClick} className={`${styles.container} group`}>
      {/* 이미지 영역 */}
      {diary.images && diary.images.length > 0 && (
        <div className={styles.image}>
          <Image
            src={diary.images[0].image_url}
            alt="일기 이미지"
            className={styles.imageClass}
            width={300}
            height={200}
          />
          {diary.images.length > 1 && (
            <div className={styles.imageMore}>+{diary.images.length - 1}</div>
          )}
        </div>
      )}

      {/* 감정 뱃지 */}
      {emotionsForBadgeList.length > 0 && (
        <EmotionBadgeList
          emotions={emotionsForBadgeList}
          className={styles.emotionList}
        />
      )}

      {/* 컨텐츠 영역 */}
      <div className={styles.body}>
        <div className={styles.contentHeader}>
          <h3 className={styles.title}>{diary.title}</h3>
          <time className={styles.date}>
            {diary.created_at
              ? formatToTimeAgo(new Date(diary.created_at).toISOString())
              : "-"}
          </time>
        </div>
        <p className={styles.content}>{diary.content}</p>
        {(diary.tags ?? []).length > 0 && (
          <div className={styles.tagList}>
            <TagList tags={(diary.tags ?? []).map((t) => ({ tag: t.tag }))} />
          </div>
        )}
        <div className={styles.footer}>
          <div className={styles.privacy}>
            <span
              className={`${styles.privacyDot} ${
                diary.is_private ? styles.privacyDotRed : styles.privacyDotGreen
              }`}
            />
            {diary.is_private ? "비공개" : "공개"}
          </div>
        </div>
      </div>
    </div>
  );
}
