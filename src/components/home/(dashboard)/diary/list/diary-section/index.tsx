"use client";

import { DiaryListDiaryCard } from "../diary-card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { List } from "@/commons/components/list";
import type { Diary } from "@/app/(dashboard)/diary/types";
import type { UserProfile } from "@/lib/get-user";
import styles from "./styles.module.css";

interface DiaryListDiarySectionProps {
  diaries: Diary[];
  router: AppRouterInstance;
  user: UserProfile | null;
}

export default function DiaryListDiarySection({
  diaries,
  router,
  user,
}: DiaryListDiarySectionProps) {
  return (
    <List
      items={diaries}
      keyExtractor={(diary) => diary.id}
      renderItem={(diary) => (
        <DiaryListDiaryCard
          key={diary.id}
          diary={diary}
          user={user}
          onClick={() => router.push(`/diary/${diary.id}`)}
          router={router}
        />
      )}
      containerClassName={styles.listContainer}
    />
  );
}
