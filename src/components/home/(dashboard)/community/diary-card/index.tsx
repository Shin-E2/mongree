"use client";

import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { EMOTIONS } from "@/mock/emotions";
import { formatToTimeAgo } from "@/lib/utils";
import TagList from "@/commons/components/tag";
import { useRouter } from "next/navigation";
import { URL } from "@/commons/constants/global-url";
import usePublicDiaryCard from "./hook";
import type { PublicDiaryCardProps, PublicEmpathyActionResult } from "./types";
import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import { EMOTION_STYLES } from "@/commons/constants/emotion-styles";
import { InteractionButton } from "@/commons/components/interaction-button";
import { Database } from "@/lib/supabase.types";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import UserProfileHeader from "@/commons/components/user-profile-header";
import EmpathyUserList from "@/commons/components/empathy-user-list";
import Link from "next/link";
import styles from "./styles.module.css";

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

  const emotions = (diary.diaryEmotion ?? []).map(({ emotion }) => {
    const emotionConfig = EMOTIONS.find((e) => e.id === emotion.id);
    return {
      ...emotion,
      bgColor: emotionConfig?.bgColor || "bg-gray-100",
      image: emotionConfig?.image || "/image/emotions/default.svg",
      label: emotion.label,
    };
  });

  // EmotionBadgeList에 전달할 감정 데이터 형식으로 변환
  const emotionsForBadgeList = (diary.diaryEmotion ?? []).map(({ emotion }) => {
    const emotionStyle =
      EMOTION_STYLES[emotion.id as keyof typeof EMOTION_STYLES];
    return {
      id: emotion.id,
      label: emotion.label,
      image: EMOTIONS.find((e) => e.id === emotion.id)?.image || "",
      bgColor: emotionStyle?.bgColor || "bg-gray-100",
    };
  });

  return (
    <article className={styles.articleContainer}>
      <Link
        href={URL().DIARY_DETAIL(diary.id)}
        className={styles.linkOverlay}
        aria-label="일기 상세 보기"
      ></Link>

      <div className={styles.headerSection}>
        <UserProfileHeader
          profileImage={diary.user?.profile_image}
          username={diary.user?.username}
          createdAt={diary.createdAt}
        />
        {emotionsForBadgeList.length > 0 && (
          <EmotionBadgeList
            emotions={emotionsForBadgeList}
            className={styles.emotionBadgeListWrapper}
          />
        )}
      </div>

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
            count={optimisticData.count}
            onClick={handleEmpathyToggle}
            disabled={isPending || !loginUser}
            className={`${styles.commentButton} ${
              optimisticData.isEmpathized ? styles.heartIconEmpathized : ""
            }`}
          />

          <InteractionButton
            icon={<MessageCircle className={styles.heartIconBase} />}
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
    </article>
  );
}
