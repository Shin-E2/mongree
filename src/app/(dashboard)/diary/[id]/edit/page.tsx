import DiaryEditForm from "@/components/home/(dashboard)/diary/edit";
import { notFound } from "next/navigation";
import { getDiaryEditData } from "./action";

export const dynamic = "force-dynamic";

interface DiaryEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiaryEditPage({ params }: DiaryEditPageProps) {
  const { id } = await params;
  const diary = await getDiaryEditData(id);

  if (!diary) {
    return notFound();
  }

  return <DiaryEditForm diary={diary} />;
}
