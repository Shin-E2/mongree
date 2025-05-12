"use client";

import type { Diary } from "@/app/(dashboard)/diary/types";
import { formatToTimeAgo } from "@/lib/utils";
import { EMOTIONS, type Emotion } from "@/mock/emotions";
import { Tag } from "lucide-react";
import Image from "next/image";
import styles from "./styles.module.css";

interface EmotionWithStyle extends Emotion {
  id: string;
  label: string;
}

interface IDiaryListDiaryCardProps {
  diary: Diary;
  onClick: () => void;
}

export function DiaryListDiaryCard({
  diary,
  onClick,
}: IDiaryListDiaryCardProps) {
  const emotions = diary.diaryEmotion.map(({ emotion }) => {
    const emotionConfig = EMOTIONS.find((e) => e.id === emotion.id);
    return {
      ...emotion,
      ...emotionConfig,
    } as EmotionWithStyle;
  });

  return (
    <div onClick={onClick} className={`${styles.container} group`}>
      {/* 이미지 영역 */}
      {diary.images.length > 0 && (
        <div className={styles.image}>
          <img
            src={diary.images[0].url}
            alt="일기 이미지"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {diary.images.length > 1 && (
            <div className={styles.imageMore}>+{diary.images.length - 1}</div>
          )}
        </div>
      )}

      {/* 감정 뱃지 */}
      <div className={styles.emotionList}>
        {emotions.length > 3 ? (
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {emotions.slice(0, 3).map((emotion) => (
                <div
                  key={emotion.id}
                  className={`${styles.emotionBadge} ${emotion.bgColor}`}
                >
                  <img
                    src={emotion.image}
                    alt={emotion.label}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
            <span className={styles.emotionMore}>
              외 {emotions.length - 3}개
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 h-full items-center">
            {emotions.map((emotion) => (
              <span
                key={emotion.id}
                className={`flex items-center px-2.5 py-1 rounded-full text-xs ${emotion.bgColor} ${emotion.textColor}`}
              >
                <Image
                  src={emotion.image}
                  alt={emotion.label}
                  width={100}
                  height={100}
                  className="w-4 h-4 mr-1"
                />
                {emotion.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className={styles.body}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={styles.title}>{diary.title}</h3>
          <time className={styles.date}>
            {formatToTimeAgo(diary.createdAt.toISOString())}
          </time>
        </div>
        <p className={styles.content}>{diary.content}</p>
        {diary.tags.length > 0 && (
          <div className={styles.tagList}>
            {diary.tags.map(({ tag }) => (
              <span key={tag.id} className={styles.tagItem}>
                <Tag className={styles.tagIcon} />
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className={styles.footer}>
          <div className={styles.privacy}>
            <span
              className={`${styles.privacyDot} ${
                diary.isPrivate ? "bg-red-500" : "bg-green-500"
              }`}
            />
            {diary.isPrivate ? "비공개" : "공개"}
          </div>
        </div>
      </div>
    </div>
  );
}
