import DiaryDetailContent from "@/components/home/(dashboard)/diary/detail";
import { notFound } from "next/navigation";
import { getDiaryDetail } from "./action";
import { getUser } from "@/lib/get-user";

interface Props {
  params: {
    id: string;
  };
}

export default async function DiaryDetailPage({ params }: Props) {
  try {
    const { id } = await params;
    const [diary, loginUser] = await Promise.all([
      getDiaryDetail(id),
      getUser(),
    ]);

    if (!diary) {
      return notFound();
    }

    return <DiaryDetailContent diary={diary} loginUser={loginUser} />;
  } catch (error) {
    console.error("일기 상세 조회 중 오류:", error);
    return notFound();
  }
}
