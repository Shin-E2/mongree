import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { IEmpathyUserListProps } from "./types";
import styles from "./styles.module.css";

export default function EmpathyUserList({
  empathies,
  maxCount = 3,
  className,
}: IEmpathyUserListProps) {
  return (
    <div className={className}>
      <div className={styles.container}>
        {empathies.slice(0, maxCount).map((empathy) => (
          <div key={empathy.id} className={styles.userImageWrapper}>
            <ImageThumbnail
              src={empathy.user?.profile_image || DEFAULT_PROFILE_IMAGE}
              alt={empathy.user?.username || "사용자"}
              width={24}
              height={24}
              shape="circle"
              className={styles.userImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
