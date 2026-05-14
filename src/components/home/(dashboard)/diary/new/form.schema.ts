import { z } from "zod";
import { EMOTIONS } from "@/mock/emotions";

const emotionIds = EMOTIONS.map((emotion) => emotion.id);

export const DIARY_TITLE_MAX_LENGTH = 80;
export const DIARY_CONTENT_MAX_LENGTH = 10000;
export const DIARY_IMAGE_MAX_COUNT = 3;
export const DIARY_IMAGE_ACCEPTED_TYPES = ["image/jpeg", "image/png"];

const normalizeTags = (tags: string[]) =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));

export const DiaryNewFormSchema = z.object({
  isPrivate: z.boolean().default(true),
  emotions: z
    .array(z.enum(emotionIds as [string, ...string[]]))
    .min(1, "감정을 하나 이상 선택해주세요."),
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요.")
    .max(
      DIARY_TITLE_MAX_LENGTH,
      `제목은 최대 ${DIARY_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`
    ),
  content: z
    .string()
    .trim()
    .min(1, "내용을 입력해주세요.")
    .max(
      DIARY_CONTENT_MAX_LENGTH,
      `내용은 최대 ${DIARY_CONTENT_MAX_LENGTH.toLocaleString()}자까지 입력할 수 있습니다.`
    ),
  tags: z
    .union([
      z.string().transform((value) =>
        value ? normalizeTags(value.split(",")) : []
      ),
      z.array(z.string()).transform(normalizeTags),
    ])
    .optional()
    .default([]),
  images: z
    .union([
      z.array(z.instanceof(File)).max(DIARY_IMAGE_MAX_COUNT),
      z.array(z.string().url()).max(DIARY_IMAGE_MAX_COUNT),
    ])
    .optional()
    .default([]),
});

export type DiaryNewFormType = z.infer<typeof DiaryNewFormSchema>;
