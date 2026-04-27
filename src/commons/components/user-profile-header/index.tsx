import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import { IUserProfileHeaderProps } from "./types";
import styles from "./styles.module.css";

export default function UserProfileHeader({
  profileImage,
  displayName,
  createdAt,
}: IUserProfileHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <ImageThumbnail
          src={profileImage || DEFAULT_PROFILE_IMAGE}
          alt={displayName || "사용자"}
          width={40}
          height={40}
          shape="circle"
          className={styles.imageClass}
        />
      </div>
      <div>
        <div className={styles.userInfo}>{displayName || "사용자"}</div>
        <div className={styles.createdAt}>
          {createdAt && !isNaN(new Date(createdAt).getTime())
            ? formatToTimeAgo(new Date(createdAt).toISOString())
            : createdAt || "날짜 정보 없음"}
        </div>
      </div>
    </div>
  );
}
