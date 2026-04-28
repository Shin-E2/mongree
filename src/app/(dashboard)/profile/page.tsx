import Link from "next/link";
import { MessageCircle, NotebookPen, Unlock } from "lucide-react";
import { HeaderStandardMFull } from "@/commons/components/header";
import { URL } from "@/commons/constants/global-url";
import { getProfilePageData } from "./action";
import ProfileSettingsClient from "./profile-settings-client";
import styles from "./styles.module.css";

export default async function ProfilePage() {
  const profileData = await getProfilePageData();

  if (!profileData.profile) {
    return (
      <div className={styles.pageContainer}>
        <HeaderStandardMFull
          title="프로필 설정"
          description="내 정보와 활동을 관리하세요"
        />
        <div className={styles.contentWrapper}>
          <section className={styles.emptyState}>
            <p className={styles.emptyTitle}>로그인이 필요합니다</p>
            <Link href={URL().LOGIN} className={styles.primaryLink}>
              로그인하기
            </Link>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <HeaderStandardMFull
        title="프로필 설정"
        description="내 정보와 활동을 한곳에서 관리하세요."
      />

      <div className={styles.contentWrapper}>
        <section className={styles.heroSection}>
          <div>
            <span className={styles.badge}>나의 mongree 공간</span>
            <h2 className={styles.heroTitle}>
              {profileData.profile.nickname}님의 기록을 정리해보세요
            </h2>
            <p className={styles.heroDescription}>
              프로필 정보는 공개 일기와 댓글에 함께 표시됩니다. 내가 남긴
              댓글도 이곳에서 한 번에 확인하고 정리할 수 있습니다.
            </p>
          </div>
        </section>

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <NotebookPen className={styles.summaryIcon} />
            <span className={styles.summaryValue}>
              {profileData.summary.diaryCount}
            </span>
            <span className={styles.summaryLabel}>작성한 일기</span>
          </article>
          <article className={styles.summaryCard}>
            <Unlock className={styles.summaryIcon} />
            <span className={styles.summaryValue}>
              {profileData.summary.publicDiaryCount}
            </span>
            <span className={styles.summaryLabel}>공개 일기</span>
          </article>
          <article className={styles.summaryCard}>
            <MessageCircle className={styles.summaryIcon} />
            <span className={styles.summaryValue}>
              {profileData.summary.commentCount}
            </span>
            <span className={styles.summaryLabel}>작성한 댓글</span>
          </article>
        </section>

        <ProfileSettingsClient
          profile={profileData.profile}
          comments={profileData.comments}
        />
      </div>
    </div>
  );
}
