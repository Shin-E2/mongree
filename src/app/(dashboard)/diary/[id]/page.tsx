import DiaryDetailContent from "@/components/home/(dashboard)/diary/detail";
import { notFound } from "next/navigation";
import { getDiaryDetail } from "./action";
import { getCurrentProfile } from "@/lib/get-user";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiaryDetailPage({ params }: Props) {
  try {
    const { id } = await params;
    const [diary, loginUser] = await Promise.all([
      getDiaryDetail(id),
      getCurrentProfile(),
    ]);

    if (!diary) {
      return notFound();
    }

    return <DiaryDetailContent diary={diary} loginUser={loginUser} />;
  } catch (error) {
    console.error("?쇨린 ?곸꽭 議고쉶 以??ㅻ쪟:", error);
    return notFound();
  }
}
