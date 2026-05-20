"use client";

import DiaryFeedCard from "@/commons/components/diary-feed-card";
import EmpathyUserList from "@/commons/components/empathy-user-list";
import { InteractionButton } from "@/commons/components/interaction-button";
import { EMOTION_STYLES } from "@/commons/constants/emotion-styles";
import { URL } from "@/commons/constants/global-url";
import { EMOTIONS } from "@/mock/emotions";
import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import usePublicDiaryCard from "./hook";
import styles from "./styles.module.css";
import type { PublicDiaryCardProps } from "./types";

export default function CommunityDiaryCard({
  diary,
  loginUser,
}: PublicDiaryCardProps) {
  const router = useRouter();
  const { optimisticData, handleEmpathyToggle, isPending } = usePublicDiaryCard(
    {
      diary,
      loginUser,
    }
  );

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
      href={URL().DIARY_DETAIL(diary.id)}
      ariaLabel="일기 상세 보기"
      profile={{
        profileImage: diary.user?.profile_image ?? null,
        displayName: diary.user?.nickname ?? null,
        createdAt: diary.createdAt
          ? new Date(diary.createdAt).toISOString()
          : null,
      }}
      emotions={emotionsForBadgeList}
      images={(diary.images ?? []).map((image) => ({
        id: image.id,
        url: image.image_url,
      }))}
      tags={(diary.tags ?? []).map((item) => item.tag)}
      footer={
        <>
          <div className={styles.interactionButtonsWrapper}>
            <InteractionButton
              icon={
                <Heart
                  className={`${styles.heartIconBase} ${
                    optimisticData.isEmpathized
                      ? styles.heartIconEmpathized
                      : ""
                  }`}
                  fill={optimisticData.isEmpathized ? "currentColor" : "none"}
                />
              }
              label="공감"
              count={optimisticData.count}
              onClick={handleEmpathyToggle}
              disabled={isPending || !loginUser}
              className={`${styles.commentButton} ${
                optimisticData.isEmpathized ? styles.heartIconEmpathized : ""
              }`}
            />

            <InteractionButton
              icon={<MessageCircle className={styles.heartIconBase} />}
              label="댓글"
              count={diary._count?.comments ?? 0}
              onClick={() => router.push(URL().DIARY_DETAIL(diary.id))}
              className={styles.commentButton}
            />
          </div>
          {optimisticData.empathies && optimisticData.empathies.length > 0 && (
            <EmpathyUserList
              empathies={optimisticData.empathies}
              className={styles.empathyUserListWrapper}
            />
          )}
        </>
      }
    />
  );
}
