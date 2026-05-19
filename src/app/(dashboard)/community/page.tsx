import { HeaderStandardMFull } from "@/commons/components/header";
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
      {/* ?ㅻ뜑*/}
      <HeaderStandardMFull
        title="怨듦컻 ?쇨린"
        description="?ㅻⅨ ?щ엺?ㅼ쓽 ?댁빞湲곕? ?쎄퀬 怨듦컧?대낫?몄슂"
      />
      <div className={styles.contentWrapper}>
        <CommunityDiarySection initialDiaries={diaries} loginUser={loginUser} />
      </div>
    </div>
  );
}
