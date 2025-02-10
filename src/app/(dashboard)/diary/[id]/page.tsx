import DiaryDetailContent from "@/components/home/(dashboard)/diary/detail";
import { notFound } from "next/navigation";
import { getDiaryDetail } from "./action";

interface Props {
  params: {
    id: string;
  };
}

export default async function DiaryDetailPage({ params }: Props) {
  try {
    const diary = await getDiaryDetail(params.id);

    if (!diary) {
      return notFound();
    }

    return <DiaryDetailContent diary={diary} />;
  } catch (error) {
    console.error("일기 상세 조회 중 오류:", error);
    return notFound();
  }
}
