import { getDiaries } from "./action";
import { getCurrentProfile } from "@/lib/get-user";
import DiaryListClient from "./diary-list-client";

export const dynamic = "force-dynamic";

export default async function DiaryListPage() {
  // 공개일기와 동일하게 초기 목록과 본인 프로필을 서버에서 미리 받아 전달한다.
  const [diaryResult, user] = await Promise.all([
    getDiaries({ page: 1 }),
    getCurrentProfile(),
  ]);

  return (
    <DiaryListClient
      initialDiaries={diaryResult.success ? diaryResult.diaries : []}
      user={user}
    />
  );
}
