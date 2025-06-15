import { EMOTIONS } from "@/mock/emotions";
import { Tables } from "@/lib/supabase.types";

export function mapDiaryEmotionsToBadgeList(
  diaryEmotion: { emotion: Tables<"emotions"> }[] | null
) {
  return (
    diaryEmotion?.map(({ emotion }: { emotion: Tables<"emotions"> }) => {
      const emotionConfig = EMOTIONS.find((e) => e.id === emotion.id);
      return {
        id: emotion.id,
        label: emotion.label,
        image: emotionConfig?.image || "",
        bgColor: emotionConfig?.bgColor || "",
        textColor: emotionConfig?.textColor || "",
        borderColor: emotionConfig?.borderColor || "",
      };
    }) || []
  );
} 