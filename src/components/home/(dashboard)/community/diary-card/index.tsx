"use client";

import EmpathyUserList from "@/commons/components/empathy-user-list";
import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import { InteractionButton } from "@/commons/components/interaction-button";
import SurfaceCard from "@/commons/components/surface-card";
import TagList from "@/commons/components/tag";
import UserProfileHeader from "@/commons/components/user-profile-header";
import { URL } from "@/commons/constants/global-url";
import { EMOTION_STYLES } from "@/commons/constants/emotion-styles";
import { EMOTIONS } from "@/mock/emotions";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  const firstImage = diary.images?.[0];

  return (
    <SurfaceCard className={styles.articleContainer}>
      <Link
        href={URL().DIARY_DETAIL(diary.id)}
        className={styles.detailLink}
        aria-label="일기 상세 보기"
      >
        <div className={styles.headerSection}>
          <UserProfileHeader
            profileImage={diary.user?.profile_image ?? null}
            displayName={diary.user?.nickname ?? null}
            createdAt={
              diary.createdAt ? new Date(diary.createdAt).toISOString() : null
            }
          />
          {emotionsForBadgeList.length > 0 && (
            <EmotionBadgeList
              emotions={emotionsForBadgeList}
              className={styles.emotionBadgeListWrapper}
            />
          )}
        </div>

        {firstImage && (
          <div className={styles.imageFrame}>
            <Image
              src={firstImage.image_url}
              alt={`${diary.title} 이미지`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={styles.diaryImage}
            />
            {diary.images && diary.images.length > 1 && (
              <span className={styles.imageCount}>+{diary.images.length - 1}</span>
            )}
          </div>
        )}

        <div className={styles.contentSection}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.title}>{diary.title}</h3>
          </div>
          <p className={styles.description}>{diary.content}</p>
          {(diary.tags ?? []).length > 0 && (
            <TagList
              tags={(diary.tags ?? []).map((t) => t.tag)}
              className={styles.tagListWrapper}
            />
          )}
        </div>
      </Link>

      <div className={styles.footerSection}>
        <div className={styles.interactionButtonsWrapper}>
          <InteractionButton
            icon={
              <Heart
                className={`${styles.heartIconBase} ${
                  optimisticData.isEmpathized ? styles.heartIconEmpathized : ""
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
      </div>
    </SurfaceCard>
  );
}
