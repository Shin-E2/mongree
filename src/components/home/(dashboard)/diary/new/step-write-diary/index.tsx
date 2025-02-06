import { ImagePreviewByDiaryNew } from "@/commons/components/image-preview";
import { InputWithCssprop } from "@/commons/components/input";
import { useFormContext } from "react-hook-form";
import DiaryNewStepWriteDiaryEmotionTags from "./emotion-tags";
import type { DiaryNewFormType } from "../form.schema";

interface IDiaryNewStepWriteDiaryProps {
  selectedEmotions: string[];
}

export default function DiaryNewStepWriteDiary({
  selectedEmotions,
}: IDiaryNewStepWriteDiaryProps) {
  const { register, watch } = useFormContext<DiaryNewFormType>();

  console.log("제목:", watch("title"));

  return (
    <section>
      {/* 태그 */}
      <DiaryNewStepWriteDiaryEmotionTags selectedEmotions={selectedEmotions} />

      {/* 제목 */}
      <InputWithCssprop
        name="title"
        placeholder="제목을 입력하세요"
        cssprop="w-full text-2xl font-semibold border-0 focus:ring-2 focus:ring-indigo-600"
      />

      {/* 내용 */}
      <textarea
        {...register("content")}
        placeholder="오늘 하루는 어땠나요?"
        className="w-full h-48 border-0 focus:ring-0 px-0 resize-none"
      />

      <div className="mt-8">
        <ImagePreviewByDiaryNew />
      </div>

      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          태그 추가
        </label>
        <InputWithCssprop
          name="tags"
          placeholder="#태그입력 (쉼표로 구분)"
          cssprop="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </section>
  );
}
