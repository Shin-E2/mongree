import EmpathyUserList from "@/commons/components/empathy-user-list";
import { InteractionButton } from "@/commons/components/interaction-button";
import { Heart } from "lucide-react";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { type EmpathySectionProps } from "./types";
import styles from "./styles.module.css";

export default function EmpathySection({
  optimisticEmpathies,
  isEmpathized,
  isPending,
  loginUser,
  handleEmpathyToggle,
  isPrivate,
}: EmpathySectionProps) {
  const empathyUsers = optimisticEmpathies.map((empathy) => ({
    id: empathy.id,
    profileImage: empathy.user?.profile_image || DEFAULT_PROFILE_IMAGE,
  }));

  if (isPrivate) {
    return null; // 비공개 일기인 경우 공감 섹션 렌더링 안 함
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <EmpathyUserList users={empathyUsers} />
        <InteractionButton
          icon={
            <Heart
              className={
                isEmpathized
                  ? styles.heartIconEmpathized
                  : styles.heartIconDefault
              }
            />
          }
          label="공감"
          count={optimisticEmpathies.length}
          onClick={handleEmpathyToggle}
          disabled={isPending || !loginUser}
          isActive={isEmpathized}
        />
      </div>
    </div>
  );
}
