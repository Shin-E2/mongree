import type { PublicDiary } from "@/app/(dashboard)/community/types";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { EMOTIONS } from "@/mock/emotions";
import { formatToTimeAgo } from "@/lib/utils";
import TagList from "@/commons/components/tag";
import styles from "./styles.module.css";

export default function CommunityDiaryCard({ diary }: { diary: PublicDiary }) {
  const emotions = diary.diaryEmotion.map(({ emotion }) => {
    const emotionConfig = EMOTIONS.find((e) => e.id === emotion.id);
    return {
      ...emotion,
      bgColor: emotionConfig?.bgColor || "bg-gray-100",
      image: emotionConfig?.image || "/image/emotions/default.svg",
      label: emotion.label,
    };
  });

  return (
    <div className={styles.container}>
      {/* 작성자 정보 */}
      <div className={styles.author}>
        <div className="flex items-center space-x-3">
          <div className={styles.profile}>
            {diary.user.profileImage && (
              <Image
                src={diary.user.profileImage}
                alt={diary.user.nickname}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
          <div>
            <div className={styles.nickname}>{diary.user.nickname}</div>
            <div className={styles.time}>
              {formatToTimeAgo(diary.createdAt.toString())}
            </div>
          </div>
        </div>
        {/* 감정 뱃지 */}
        {emotions.length > 0 && (
          <div className={styles.emotionList}>
            <div className="flex -space-x-2">
              {emotions.slice(0, 3).map((emotion) => (
                <div
                  key={emotion.id}
                  className={`${styles.emotionBadge} ${emotion.bgColor}`}
                >
                  <Image
                    src={emotion.image}
                    alt={emotion.label}
                    width={24}
                    height={24}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
            {emotions.length > 3 && (
              <span className={styles.emotionMore}>
                외 {emotions.length - 3}개
              </span>
            )}
          </div>
        )}
      </div>

      {/* 일기 내용 미리보기 */}
      <div className={styles.body}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={styles.title}>{diary.title}</h3>
          <time className={styles.time}>
            {formatToTimeAgo(diary.createdAt.toString())}
          </time>
        </div>
        <p className={styles.content}>{diary.content}</p>
        <TagList
          tags={diary.tags.map((t) => t.tag)}
          className={styles.tagList}
        />
      </div>

      {/* 상호작용(공감, 댓글, 공감한 사용자) */}
      <div className={styles.footer}>
        <div className="flex items-center space-x-4">
          <button className={styles.button}>
            <Heart className="w-4 h-4" />
            <span className={styles.buttonCount}>{diary._count.empathies}</span>
          </button>
          <button className={styles.button}>
            <MessageCircle className="w-4 h-4" />
            <span className={styles.buttonCount}>{diary._count.comments}</span>
          </button>
        </div>
        <div className={styles.empathyList}>
          <div className="flex -space-x-2">
            {diary.empathies.slice(0, 3).map((empathy) => (
              <div key={empathy.id} className={styles.empathyProfile}>
                {empathy.user.profileImage && (
                  <Image
                    src={empathy.user.profileImage}
                    alt="empathy-user"
                    width={24}
                    height={24}
                    className="object-cover w-full h-full rounded-full"
                  />
                )}
              </div>
            ))}
          </div>
          <span className={styles.empathyText}>
            +{diary._count.empathies}명이 공감
          </span>
        </div>
      </div>
    </div>
  );
}
