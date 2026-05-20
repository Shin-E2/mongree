import { getPublicDiaries } from "./action";
import CommunityDiarySection from "@/components/home/(dashboard)/community/diary-section";
import { getCurrentProfile } from "@/lib/get-user";
import styles from "./styles.module.css";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [{ diaries }, loginUser] = await Promise.all([
    getPublicDiaries({ page: 1 }),
    getCurrentProfile(),
  ]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <CommunityDiarySection initialDiaries={diaries} loginUser={loginUser} />
      </div>
    </div>
  );
}
