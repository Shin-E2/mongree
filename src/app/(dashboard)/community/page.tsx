import { HeaderStandardMFull } from "@/commons/components/header";
import { getPublicDiaries } from "./action";
import CommunityDiarySection from "@/components/home/(dashboard)/community/diary-section";

export default async function CommunityPage() {
  const { diaries } = await getPublicDiaries({ page: 1 });

  return (
    <div className="mb-20">
      {/* 헤더*/}
      <HeaderStandardMFull
        title="공개 일기"
        description="다른 사람들의 이야기를 읽고 공감해보세요"
      />
      <div className="flex flex-col gap-6 px-4 py-6 md:mx-32">
        <CommunityDiarySection initialDiaries={diaries} />
      </div>
    </div>
  );
}
