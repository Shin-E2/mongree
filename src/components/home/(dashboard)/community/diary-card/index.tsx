"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { EMOTIONS } from "@/mock/emotions";
import { formatToTimeAgo } from "@/lib/utils";
import TagList from "@/commons/components/tag";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { URL } from "@/commons/constants/global-url";
import usePublicDiaryCard from "./hook";
import type { PublicDiaryCardProps } from "./types";

export default function CommunityDiaryCard({
  diary,
  loginUser,
}: PublicDiaryCardProps) {
  const router = useRouter();
  const { optimisticData, isPending, handleEmpathyToggle } = usePublicDiaryCard(
    {
      diary,
      loginUser,
    }
  );

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
    <div
      className={styles.container}
      style={{ cursor: "pointer" }}
      onClick={() => router.push(URL().DIARY_DETAIL(diary.id))}
    >
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
          <button
            className={`${styles.button} ${
              optimisticData.isEmpathized ? styles.buttonActive : ""
            }`}
            onClick={handleEmpathyToggle}
            disabled={isPending}
          >
            <Heart
              className={`w-4 h-4 ${
                optimisticData.isEmpathized ? "text-indigo-700" : ""
              }`}
              fill={optimisticData.isEmpathized ? "currentColor" : "none"}
            />

            <span className={styles.buttonCount}>{optimisticData.count}</span>
          </button>

          <button className={styles.button}>
            <MessageCircle className="w-4 h-4" />
            <span className={styles.buttonCount}>{diary._count.comments}</span>
          </button>
        </div>
        <div className={styles.empathyList}>
          <div className="flex -space-x-2">
            {optimisticData.empathies.slice(0, 3).map((empathy) => (
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
            +{optimisticData.count}명이 공감
          </span>
        </div>
      </div>
    </div>
  );
}
