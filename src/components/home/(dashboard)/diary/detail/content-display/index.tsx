import UserProfileHeader from "@/commons/components/user-profile-header";
import { EmotionBadgeList } from "@/commons/components/emotion-badge-list";
import ImageThumbnailList from "@/commons/components/image-thumbnail-list";
import { TagList } from "@/commons/components/tag-list";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import { Tables } from "@/lib/supabase.types";
import { DiaryContentDisplayProps } from "./types";
import styles from "./styles.module.css";

export default function DiaryContentDisplay({
  diary,
  emotionsForBadgeList,
}: DiaryContentDisplayProps) {
  return (
    <div className={styles.container}>
      {/* 작성자 및 감정 섹션 */}
      <div className={styles.authorEmotionSection}>
        <div className={styles.profileHeaderWrapper}>
          <UserProfileHeader
            profileImage={diary.user?.profile_image || DEFAULT_PROFILE_IMAGE}
            username={diary.user?.username || "사용자"}
            createdAt={
              diary.created_at
                ? formatToTimeAgo(new Date(diary.created_at).toISOString())
                : "날짜 정보 없음"
            }
          />
          {!(diary.is_private ?? false) && (
            <span className={styles.publicBadge}>공개</span>
          )}
        </div>

        {/* 감정 뱃지 */}
        {diary.diaryEmotion && diary.diaryEmotion.length > 0 && (
          <EmotionBadgeList
            emotions={emotionsForBadgeList}
            className={styles.emotionBadgeList}
          />
        )}

        {/* 제목 */}
        <h1 className={styles.title}>{diary.title}</h1>
      </div>

      {/* 이미지 섹션 */}
      {diary.images && diary.images.length > 0 && (
        <div className={styles.imageSection}>
          <ImageThumbnailList
            images={diary.images.map(
              (img: Tables<"diary_images">) => img.image_url
            )}
            className={styles.imageThumbnailList}
          />
        </div>
      )}

      {/* 본문 섹션 */}
      <div className={styles.contentSection}>
        <div className={styles.proseWrapper}>
          <div className={styles.diaryContent}>{diary.content}</div>
        </div>

        {/* 태그 섹션 */}
        {diary.tags && diary.tags.length > 0 && (
          <div className={styles.tagSection}>
            <TagList tags={diary.tags} />
          </div>
        )}
      </div>
    </div>
  );
}
