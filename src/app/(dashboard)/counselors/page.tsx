import { HeaderStandardMFull } from "@/commons/components/header";
import { Users } from "lucide-react";
import styles from "./styles.module.css";

export default function CounselorListPage() {
  return (
    <div className={styles.mainContainer}>
      <HeaderStandardMFull
        title="상담사 찾기"
        description="신뢰할 수 있는 전문 상담사를 만나보세요"
      />
      <div className={styles.contentWrapper}>
        <div className={styles.comingSoonCard}>
          <Users className={styles.icon} />
          <h2 className={styles.title}>준비 중입니다</h2>
          <p className={styles.description}>
            전문 심리 상담사 연결 기능을 준비 중입니다.
            곧 더 나은 서비스로 찾아뵙겠습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
