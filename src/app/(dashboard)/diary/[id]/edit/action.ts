"use server";

import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export interface DiaryEditData {
  id: string;
  title: string;
  content: string;
  isPrivate: boolean;
  emotions: string[];
  tags: string[];
}

interface DiaryEditRow {
  id: string;
  title: string;
  content: string;
  is_private: boolean | null;
  user_id: string;
  diary_emotions: { emotion_id: string }[] | null;
  diary_tags:
    | {
        tags: { name: string } | null;
      }[]
    | null;
}

const parseEditFormData = (formData: FormData) => {
  const tags = formData.get("tags");

  return {
    title: formData.get("title")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
    isPrivate: formData.get("isPrivate") === "true",
    emotions: formData.getAll("emotions").map((emotion) => emotion.toString()),
    tags: tags
      ? tags
          .toString()
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    images: [],
  };
};

async function processTagsAndGetIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tagNames: string[]
): Promise<string[]> {
  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    const { data: existingTag, error: findError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagName)
      .maybeSingle();

    if (findError) {
      throw new Error(`태그 조회 실패: ${findError.message}`);
    }

    if (existingTag) {
      tagIds.push(existingTag.id);
      continue;
    }

    const { data: newTag, error: createError } = await supabase
      .from("tags")
      .insert({ name: tagName })
      .select("id")
      .single();

    if (createError) {
      throw new Error(`태그 생성 실패: ${createError.message}`);
    }

    tagIds.push(newTag.id);
  }

  return tagIds;
}

export async function getDiaryEditData(
  diaryId: string
): Promise<DiaryEditData | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      id,
      title,
      content,
      is_private,
      user_id,
      diary_emotions (
        emotion_id
      ),
      diary_tags (
        tags (
          name
        )
      )
      `
    )
    .eq("id", diaryId)
    .is("deleted_at", null)
    .single()
    .returns<DiaryEditRow>();

  if (error || !data || data.user_id !== user.id) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    isPrivate: data.is_private ?? true,
    emotions: data.diary_emotions?.map((item) => item.emotion_id) ?? [],
    tags:
      data.diary_tags
        ?.map((item) => item.tags?.name)
        .filter((tag): tag is string => Boolean(tag)) ?? [],
  };
}

export async function updateDiary(diaryId: string, formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const parsedData = parseEditFormData(formData);
  const validationResult = await DiaryNewFormSchema.safeParseAsync(parsedData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "입력값을 다시 확인해주세요.",
    };
  }

  const supabase = await createClient();
  const { data: diary, error: findError } = await supabase
    .from("diaries")
    .select("id, user_id")
    .eq("id", diaryId)
    .is("deleted_at", null)
    .single();

  if (findError || !diary) {
    return { success: false, error: "수정할 일기를 찾을 수 없습니다." };
  }

  if (diary.user_id !== user.id) {
    return { success: false, error: "수정 권한이 없습니다." };
  }

  const { error: diaryError } = await supabase
    .from("diaries")
    .update({
      title: validationResult.data.title,
      content: validationResult.data.content,
      is_private: validationResult.data.isPrivate,
    })
    .eq("id", diaryId);

  if (diaryError) {
    return { success: false, error: `일기 수정 실패: ${diaryError.message}` };
  }

  const { error: deleteEmotionError } = await supabase
    .from("diary_emotions")
    .delete()
    .eq("diary_id", diaryId);

  if (deleteEmotionError) {
    return {
      success: false,
      error: `감정 초기화 실패: ${deleteEmotionError.message}`,
    };
  }

  const { error: emotionError } = await supabase.from("diary_emotions").insert(
    validationResult.data.emotions.map((emotionId) => ({
      diary_id: diaryId,
      emotion_id: emotionId,
    }))
  );

  if (emotionError) {
    return { success: false, error: `감정 수정 실패: ${emotionError.message}` };
  }

  const { error: deleteTagError } = await supabase
    .from("diary_tags")
    .delete()
    .eq("diary_id", diaryId);

  if (deleteTagError) {
    return {
      success: false,
      error: `태그 초기화 실패: ${deleteTagError.message}`,
    };
  }

  if (validationResult.data.tags.length > 0) {
    const tagIds = await processTagsAndGetIds(
      supabase,
      validationResult.data.tags
    );

    const { error: tagError } = await supabase.from("diary_tags").insert(
      tagIds.map((tagId) => ({
        diary_id: diaryId,
        tag_id: tagId,
      }))
    );

    if (tagError) {
      return { success: false, error: `태그 수정 실패: ${tagError.message}` };
    }
  }

  revalidatePath("/diary");
  revalidatePath(`/diary/${diaryId}`);
  revalidatePath("/home");

  return { success: true };
}
