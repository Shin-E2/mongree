import { HeaderStandardMFull } from "@/commons/components/header";
import { User } from "lucide-react";
import styles from "./styles.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.pageContainer}>
      <HeaderStandardMFull
        title="마이페이지"
        description="나의 정보를 관리하세요"
      />
      <div className={styles.contentWrapper}>
        <div className={styles.comingSoonCard}>
          <User className={styles.icon} />
          <h2 className={styles.title}>준비 중입니다</h2>
          <p className={styles.description}>
            프로필 편집, 닉네임 변경, 계정 설정 기능을 준비 중입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
