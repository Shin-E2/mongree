"use server";

import {
  deleteImagesFromS3,
  uploadMultipleImages,
} from "@/commons/utils/upload-images";
import {
  DIARY_IMAGE_MAX_COUNT,
  DiaryNewFormSchema,
} from "@/components/home/(dashboard)/diary/new/form.schema";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import { revalidateDiaryUpdated } from "@/commons/utils/cache-revalidation";
import {
  buildEditDiaryImagePayloads,
  extractEditDiaryFormData,
  type EditDiaryFormData,
  type EditDiaryImagePayload,
} from "@/lib/diary/edit-diary-form";
import type { Json } from "@/lib/supabase.types";

export interface DiaryEditImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface DiaryEditData {
  id: string;
  title: string;
  content: string;
  isPrivate: boolean;
  emotions: string[];
  tags: string[];
  images: DiaryEditImage[];
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
  diary_images:
    | {
        id: string;
        image_url: string;
        sort_order: number;
      }[]
    | null;
}

interface UpdateDiaryRpcResult {
  diary_id: string;
  removed_image_urls: string[] | null;
  was_private: boolean | null;
  is_private: boolean | null;
}

async function cleanupUploadedImages(uploadedImageUrls: string[]) {
  if (uploadedImageUrls.length === 0) return;
  await deleteImagesFromS3(uploadedImageUrls);
}

export async function getDiaryEditData(
  diaryId: string
): Promise<DiaryEditData | null> {
  const user = await getCurrentProfile();
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
      ),
      diary_images (
        id,
        image_url,
        sort_order
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
    images:
      data.diary_images
        ?.sort((a, b) => a.sort_order - b.sort_order)
        .map((image) => ({
          id: image.id,
          url: image.image_url,
          sortOrder: image.sort_order,
        })) ?? [],
  };
}

export async function updateDiary(diaryId: string, formData: FormData) {
  const user = await getCurrentProfile();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  let parsedData: EditDiaryFormData;
  try {
    parsedData = extractEditDiaryFormData(formData);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "입력값을 다시 확인해주세요.",
    };
  }

  const validationResult = await DiaryNewFormSchema.safeParseAsync(parsedData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "입력값을 다시 확인해주세요.",
    };
  }

  if (parsedData.keptImageIds.length + parsedData.images.length > DIARY_IMAGE_MAX_COUNT) {
    return {
      success: false,
      error: `이미지는 최대 ${DIARY_IMAGE_MAX_COUNT}개까지 등록할 수 있습니다.`,
    };
  }

  let uploadedImageUrls: string[] = [];

  try {
    if (parsedData.images.length > 0) {
      uploadedImageUrls = await uploadMultipleImages(parsedData.images);
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "이미지 업로드에 실패했습니다.";
    return { success: false, error: message };
  }

  const newImages: EditDiaryImagePayload[] = buildEditDiaryImagePayloads(
    uploadedImageUrls,
    parsedData.images
  );

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_diary_transaction", {
    p_diary_id: diaryId,
    p_title: validationResult.data.title,
    p_content: validationResult.data.content,
    p_is_private: validationResult.data.isPrivate,
    p_emotion_ids: validationResult.data.emotions,
    p_tag_names: validationResult.data.tags,
    p_kept_image_ids: parsedData.keptImageIds,
    p_new_images: newImages as unknown as Json,
  });

  if (error || !data?.[0]) {
    await cleanupUploadedImages(uploadedImageUrls);
    return {
      success: false,
      error: `일기 수정 실패: ${error?.message ?? "RPC 응답이 비어 있습니다."}`,
    };
  }

  const result = data[0] as UpdateDiaryRpcResult;
  const removedImageUrls = result.removed_image_urls ?? [];

  if (removedImageUrls.length > 0) {
    try {
      await deleteImagesFromS3(removedImageUrls);
    } catch (error) {
      console.error("삭제된 이미지 파일 정리 실패:", error);
    }
  }

  revalidateDiaryUpdated({
    userId: user.id,
    diaryId,
    isPrivate: result.is_private ?? validationResult.data.isPrivate,
    wasPrivate: result.was_private ?? true,
  });

  return { success: true };
}
