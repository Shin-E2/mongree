"use client";

import { DiaryListDiaryCard } from "../diary-card";
import { Diary } from "@/app/(dashboard)/diary/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DiaryListDiarySectionProps {
  diaries: Diary[];
  router: AppRouterInstance;
}

export default function DiaryListDiarySection({
  diaries,
  router,
}: DiaryListDiarySectionProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {diaries.map((diary) => (
        <DiaryListDiaryCard
          key={diary.id}
          diary={diary}
          onClick={() => router.push(`/diary/${diary.id}`)}
        />
      ))}
    </section>
  );
}
