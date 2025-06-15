"use client";

import { DiaryListDiaryCard } from "../diary-card";
// import type { Database } from "@/lib/supabase.types"; // Database 타입 import 불필요
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { List } from "@/commons/components/list";
import type { DiaryWithRelations } from "@/components/home/(dashboard)/diary/detail/types"; // DiaryWithRelations 타입 import
import styles from "./styles.module.css";

interface DiaryListDiarySectionProps {
  diaries: DiaryWithRelations[]; // DiaryWithRelations 타입 사용
  router: AppRouterInstance;
}

export default function DiaryListDiarySection({
  diaries,
  router,
}: DiaryListDiarySectionProps) {
  return (
    <List
      items={diaries}
      keyExtractor={(diary) => diary.id}
      renderItem={(diary) => (
        <DiaryListDiaryCard
          key={diary.id}
          diary={diary}
          onClick={() => router.push(`/diary/${diary.id}`)}
          router={router}
        />
      )}
      containerClassName={styles.listContainer}
    />
  );
}
