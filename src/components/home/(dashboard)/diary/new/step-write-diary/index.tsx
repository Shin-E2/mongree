import { ImagePreviewByDiaryNew } from "@/commons/components/image-preview";
import { InputWithCssprop } from "@/commons/components/input";
import { useFormContext } from "react-hook-form";
import DiaryNewStepWriteDiaryEmotionTags from "./emotion-tags";
import type { DiaryNewFormType } from "../form.schema";
import { InputFieldStandardSFull } from "@/commons/components/input-field";

export default function DiaryNewStepWriteDiary() {
  const { register } = useFormContext<DiaryNewFormType>();

  return (
    <section className="flex flex-col gap-8">
      {/* 태그 */}
      <DiaryNewStepWriteDiaryEmotionTags />
      {/* 제목 */}
      <InputWithCssprop
        name="title"
        register={register}
        placeholder="제목을 입력하세요"
        cssprop="w-full text-2xl font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
      />
      {/* 내용 */}
      <textarea
        {...register("content")}
        placeholder="오늘 하루는 어땠나요?"
        className="w-full h-48 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
      />
      {/* 사진 */}
      <ImagePreviewByDiaryNew multiple maxImages={3} />
      {/* 태그 */}
      <InputFieldStandardSFull
        title="태그 추가"
        name="tags"
        register={register}
        placeholder="#태그입력 (쉼표로 구분)"
      />
    </section>
  );
}
