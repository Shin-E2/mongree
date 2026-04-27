import { HeaderStandardMFull } from "@/commons/components/header";
import { getPublicDiaries } from "./action";
import CommunityDiarySection from "@/components/home/(dashboard)/community/diary-section";
import { getUser } from "@/lib/get-user";
import styles from "./styles.module.css";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [{ diaries }, loginUser] = await Promise.all([
    getPublicDiaries({ page: 1 }),
    getUser(),
  ]);

  return (
    <div className={styles.pageContainer}>
      {/* 헤더*/}
      <HeaderStandardMFull
        title="공개 일기"
        description="다른 사람들의 이야기를 읽고 공감해보세요"
      />
      <div className={styles.contentWrapper}>
        <CommunityDiarySection initialDiaries={diaries} loginUser={loginUser} />
      </div>
    </div>
  );
}
