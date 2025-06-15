import Image from "next/image";
import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import { IUserProfileHeaderProps } from "./types";
import styles from "./styles.module.css";

export default function UserProfileHeader({
  profileImage,
  username,
  createdAt,
}: IUserProfileHeaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <ImageThumbnail
          src={profileImage || DEFAULT_PROFILE_IMAGE}
          alt={username || "사용자"}
          width={40}
          height={40}
          shape="circle"
          className={styles.imageClass}
        />
      </div>
      <div>
        <div className={styles.userInfo}>{username || "사용자"}</div>
        <div className={styles.createdAt}>
          {createdAt
            ? formatToTimeAgo(new Date(createdAt).toISOString())
            : "날짜 정보 없음"}
        </div>
      </div>
    </div>
  );
}
