"use client";

import useDiaryList from "@/app/(dashboard)/diary/hook";
import { DiaryListDiaryCard } from "../diary-card";

export default function DiaryListDiarySection() {
  const { diaries, router } = useDiaryList();
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
