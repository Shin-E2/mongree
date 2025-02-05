import { EMOTIONS } from "@/mock/emotions";
import { z } from "zod";

// 이미지 스키마
const DiaryImageSchema = z.object({
  url: z.string().url("올바른 URL 형식이 아닙니다"),
  order: z.number().int().min(0).max(2), // 0, 1, 2 순서만 허용
});

// 감정 id 타입 정의
const emotionIds = EMOTIONS.map((e) => e.id);
type EmotionId = (typeof emotionIds)[number];

export const DiaryNewFormSchema = z.object({
  emotions: z
    .array(z.enum(emotionIds as [string, ...string[]])) // 최소 한 개의 문자열 필요
    .min(1, "감정을 하나 이상 선택해주세요"),
  // .max(3, "감정은 최대 3개까지 선택 가능합니다"),
  isPrivate: z.boolean().default(true),
  title: z
    .string()
    .trim()
    .min(1, "필수입력 사항입니다")
    .max(50, "제목은 최대 50자까지 입력 가능합니다"),
  content: z
    .string()
    .trim()
    .min(1, "필수입력 사항입니다")
    .max(300, "내용은 최대 300자까지 입력 가능합니다"),
  images: z
    .array(DiaryImageSchema)
    .max(3, "이미지는 최대 3개까지 업로드 가능합니다")
    .optional(),
  tags: z
    .array(z.string().trim().min(1))
    .max(5, "태그는 최대 5개까지 입력 가능합니다")
    .optional(),
});

// 유틸리티 타입 정의
export type DiaryNewFormType = z.infer<typeof DiaryNewFormSchema>;
export type DiaryImageType = z.infer<typeof DiaryImageSchema>;
