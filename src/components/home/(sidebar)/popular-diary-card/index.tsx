"use client";

import { Heart, MessageCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";
import UserProfileHeader from "@/commons/components/user-profile-header";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import ImageThumbnailList from "@/commons/components/image-thumbnail-list";
import { InteractionButton } from "@/commons/components/interaction-button";
import EmpathyUserList from "@/commons/components/empathy-user-list";
import styles from "./styles.module.css";

interface IHomePopularDiaryCardProps {
  diary?: {
    id: number;
    title: string;
    content: string;
    emotion: {
      type: string;
      label: string;
    };
    authorName: string;
    likes: number;
    comments: number;
    createdAt: string;
    images?: string[];
    profileImage?: string;
  };
}

export default function HomePopularDiaryCard({
  diary,
}: IHomePopularDiaryCardProps) {
  const router = useRouter();
  const diaryData = diary;

  return (
    <div
      onClick={() => router.push(`/diary/${diaryData?.id}`)}
      className={styles.cardContainer}
    >
      {/* 헤더: 작성자 정보 & 감정 */}
      <div className={styles.header}>
        <UserProfileHeader
          profileImage={diaryData?.profileImage || DEFAULT_PROFILE_IMAGE}
          username={diaryData?.authorName}
          createdAt={diaryData?.createdAt}
        />
        <span className={styles.emotionBadge}>{diaryData?.emotion.label}</span>
      </div>

      {/* 본문 */}
      <div className={styles.body}>
        <h3 className={styles.title}>{diaryData?.title}</h3>
        <p className={styles.content}>{diaryData?.content}</p>

        {/* 이미지 썸네일 영역 - 이미지가 있을 때만 표시 */}
        {diaryData?.images && diaryData?.images.length > 0 && (
          <div className={styles.imageThumbnailWrapper}>
            <ImageThumbnailList images={diaryData.images} />
          </div>
        )}
      </div>

      {/* 푸터: 상호작용 정보 */}
      <div className={styles.footer}>
        <div className={styles.interactionButtons}>
          <InteractionButton
            icon={<Heart className={styles.iconBase} />}
            count={diaryData?.likes}
            className={styles.interactionButtonText}
          />
          <InteractionButton
            icon={<MessageCircle className={styles.iconBase} />}
            count={diaryData?.comments}
            className={styles.interactionButtonText}
          />
        </div>
        {diaryData && diaryData.likes > 0 && (
          <EmpathyUserList
            empathies={Array.from({ length: Math.min(diaryData.likes, 3) }).map(
              (_, idx) => ({
                id: `mock-user-${idx}`,
                user: {
                  id: `user-${idx}`,
                  username: `User ${idx + 1}`,
                  profile_image: DEFAULT_PROFILE_IMAGE,
                },
              })
            )}
            maxCount={3}
            className={styles.empathyUserList}
          />
        )}
      </div>
    </div>
  );
}
