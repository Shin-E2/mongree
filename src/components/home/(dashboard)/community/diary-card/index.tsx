"use client";

import { Heart, MessageCircle } from "lucide-react";
import { EMOTIONS } from "@/mock/emotions";
import TagList from "@/commons/components/tag";
import { useRouter } from "next/navigation";
import { URL } from "@/commons/constants/global-url";
import usePublicDiaryCard from "./hook";
import type { PublicDiaryCardProps } from "./types";
import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import { EMOTION_STYLES } from "@/commons/constants/emotion-styles";
import { InteractionButton } from "@/commons/components/interaction-button";
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
    <article className={styles.articleContainer}>
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
    </article>
  );
}
