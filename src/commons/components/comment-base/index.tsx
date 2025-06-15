import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import { Heart, Trash2 } from "lucide-react";
import styles from "./styles.module.css";
import type { ICommentBaseProps } from "./types";
import { ImageThumbnail } from "@/commons/components/image-thumbnail";

export const CommentBase = ({
  user,
  content,
  createdAt,
  likesCount,
  isLiked,
  isOwner,
  onLike,
  onReply,
  onDelete,
  cssprop,
  className,
}: ICommentBaseProps) => {
  return (
    <div className={`${cssprop} ${className}`}>
      <div className={styles.mainContainer}>
        <div className={styles.imageWrapper}>
          <ImageThumbnail
            src={user?.profile_image || DEFAULT_PROFILE_IMAGE}
            alt={user?.username || "사용자"}
            width={40}
            height={40}
            shape="circle"
            className={styles.userImage}
          />
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.headerContainer}>
            <div className={styles.userInfoContainer}>
              <span className={styles.username}>
                {user?.username || "사용자"}
              </span>
              <span className={styles.divider}>•</span>
              <span className={styles.timestamp}>
                {createdAt
                  ? formatToTimeAgo(new Date(createdAt).toISOString())
                  : "-"}
              </span>
            </div>

            <div className={styles.actionButtonsContainer}>
              {onLike && (
                <button
                  onClick={onLike}
                  className={`${styles.likeButtonBase} ${
                    isLiked ? styles.likeButtonLiked : styles.likeButtonUnliked
                  } ${styles.likeButtonHover}`}
                >
                  <Heart
                    className={`${styles.heartIcon} ${
                      isLiked ? styles.heartIconFilled : ""
                    }`}
                  />
                  <span className={styles.likesCount}>{likesCount}</span>
                </button>
              )}
              {onReply && (
                <button onClick={onReply} className={styles.replyButton}>
                  답글 달기
                </button>
              )}
              {isOwner && (
                <button
                  onClick={onDelete}
                  className={styles.deleteButton}
                  title="삭제하기"
                >
                  <Trash2 className={styles.deleteIcon} />
                </button>
              )}
            </div>
          </div>

          <p className={styles.commentContent}>{content}</p>
        </div>
      </div>
    </div>
  );
};
