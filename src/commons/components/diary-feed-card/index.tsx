"use client";

import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import SurfaceCard from "@/commons/components/surface-card";
import TagList from "@/commons/components/tag";
import UserProfileHeader from "@/commons/components/user-profile-header";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface DiaryFeedCardEmotion {
  id: string;
  label: string;
  image: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export interface DiaryFeedCardTag {
  id: string;
  name: string;
}

export interface DiaryFeedCardImage {
  id: string;
  url: string;
}

export interface DiaryFeedCardProfile {
  profileImage: string | null;
  displayName: string | null;
  createdAt: string | null;
}

interface DiaryFeedCardProps {
  title: string;
  content: string;
  href?: string;
  ariaLabel: string;
  profile: DiaryFeedCardProfile;
  emotions: DiaryFeedCardEmotion[];
  images: DiaryFeedCardImage[];
  tags: DiaryFeedCardTag[];
  footer?: ReactNode;
  onClick?: () => void;
}

export default function DiaryFeedCard({
  title,
  content,
  href,
  ariaLabel,
  profile,
  emotions,
  images,
  tags,
  footer,
  onClick,
}: DiaryFeedCardProps) {
  const firstImage = images[0];
  const body = (
    <>
      <div className={styles.headerSection}>
        <UserProfileHeader
          profileImage={profile.profileImage}
          displayName={profile.displayName}
          createdAt={profile.createdAt}
        />
        {emotions.length > 0 && (
          <EmotionBadgeList
            emotions={emotions}
            className={styles.emotionBadgeListWrapper}
          />
        )}
      </div>

      {firstImage && (
        <div className={styles.imageFrame}>
          <Image
            src={firstImage.url}
            alt={`${title} 이미지`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={styles.diaryImage}
          />
          {images.length > 1 && (
            <span className={styles.imageCount}>+{images.length - 1}</span>
          )}
        </div>
      )}

      <div className={styles.contentSection}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p className={styles.description}>{content}</p>
        {tags.length > 0 && (
          <TagList tags={tags} className={styles.tagListWrapper} />
        )}
      </div>
    </>
  );

  return (
    <SurfaceCard className={styles.articleContainer} onClick={onClick}>
      {href ? (
        <Link href={href} className={styles.detailLink} aria-label={ariaLabel}>
          {body}
        </Link>
      ) : (
        <div className={styles.detailLink} role="button" tabIndex={0}>
          {body}
        </div>
      )}
      {footer && <div className={styles.footerSection}>{footer}</div>}
    </SurfaceCard>
  );
}
