// form.schema.ts
import { z } from "zod";
import { EMOTIONS } from "@/mock/emotions";

const emotionIds = EMOTIONS.map((e) => e.id);

export const DiaryNewFormSchema = z.object({
  isPrivate: z.boolean().default(true),
  emotions: z
    .array(z.enum(emotionIds as [string, ...string[]]))
    .min(1, "감정을 하나 이상 선택해주세요"),
  title: z
    .string()
    .min(1, "필수입력 사항입니다")
    .max(50, "제목은 최대 50자까지 입력 가능합니다"),
  content: z
    .string()
    .min(1, "필수입력 사항입니다")
    .max(300, "내용은 최대 300자까지 입력 가능합니다"),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []
    ),
  images: z.array(z.string()).optional(),
});

export type DiaryNewFormType = z.infer<typeof DiaryNewFormSchema>;
