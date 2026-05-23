"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileSection } from "./profile-section";
import { DiarySection } from "./diary-section";
import { BillingSection } from "./billing-section";
import { CommentsSection } from "./comments-section";
import type {
  ProfileCommentItem,
  ProfileDiaryItem,
  ProfilePageData,
} from "./action";
import styles from "./styles.module.css";

interface ProfileSettingsClientProps {
  profile: NonNullable<ProfilePageData["profile"]>;
  comments: ProfileCommentItem[];
  diaries: ProfileDiaryItem[];
  summary: ProfilePageData["summary"];
}

export default function ProfileSettingsClient({
  profile,
  comments,
  diaries,
  summary,
}: ProfileSettingsClientProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleRefresh = () => router.refresh();

  return (
    <div className={styles.interactiveGrid}>
      <ProfileSection profile={profile} onMessage={setMessage} onRefresh={handleRefresh} />
      <DiarySection diaries={diaries} summary={summary} onMessage={setMessage} onRefresh={handleRefresh} />
      <BillingSection onMessage={setMessage} />
      <CommentsSection comments={comments} onMessage={setMessage} onRefresh={handleRefresh} />
      {message && <p className={styles.toastMessage}>{message}</p>}
    </div>
  );
}
