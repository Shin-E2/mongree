import type { PublicDiary } from "@/app/(dashboard)/community/types";
import CommunityDiaryCard from "../diary-card";

export default function CommunityDiaryList({
  diaries,
}: {
  diaries: PublicDiary[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {diaries.map((diary, idx) => (
        <CommunityDiaryCard key={diary.id ?? idx} diary={diary} />
      ))}
    </div>
  );
}
