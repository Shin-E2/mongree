"use server";

import { deleteImagesFromS3 } from "@/commons/utils/upload-images";
import { createClient } from "@/lib/supabase-server";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import { getCurrentProfile } from "@/lib/get-user";
import { formatZodError } from "@/commons/utils/errorFormatters";
import { revalidateDiaryCreated } from "@/commons/utils/cache-revalidation";
import {
  buildDiaryImagePayloads,
  extractCreateDiaryFormData,
  type CreateDiaryFormData,
  type DiaryImagePayload,
} from "@/lib/diary/create-diary-form";
import type { Json } from "@/lib/supabase.types";

interface CreateDiaryWithoutRpcParams {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  title: string;
  content: string;
  isPrivate: boolean;
  emotionIds: string[];
  tagNames: string[];
  images: DiaryImagePayload[];
}

function isMissingCreateDiaryRpc(error: { message?: string } | null) {
  const message = error?.message ?? "";
  return (
    message.includes("Could not find the function") &&
    message.includes("create_diary_transaction")
  );
}

async function createDiaryWithoutRpc({
  supabase,
  userId,
  title,
  content,
  isPrivate,
  emotionIds,
  tagNames,
  images,
}: CreateDiaryWithoutRpcParams) {
  let diaryId: string | null = null;

  try {
    const { data: diary, error: diaryError } = await supabase
      .from("diaries")
      .insert({
        user_id: userId,
        title,
        content,
        is_private: isPrivate,
      })
      .select("id")
      .single();

    if (diaryError || !diary) {
      throw new Error(diaryError?.message ?? "일기 생성 응답이 비어 있습니다.");
    }

    diaryId = diary.id;
    const createdDiaryId = diary.id;

    if (emotionIds.length > 0) {
      const { error: emotionError } = await supabase
        .from("diary_emotions")
        .insert(
          emotionIds.map((emotionId) => ({
            diary_id: createdDiaryId,
            emotion_id: emotionId,
          }))
        );

      if (emotionError) throw new Error(emotionError.message);
    }

    if (tagNames.length > 0) {
      const tagIds = await Promise.all(
        tagNames.map(async (tagName) => {
          const { data: tagId, error: tagError } = await supabase.rpc(
            "get_or_create_tag_id",
            { tag_name: tagName }
          );

          if (tagError || !tagId) {
            throw new Error(tagError?.message ?? "태그 생성 응답이 비어 있습니다.");
          }

          return tagId;
        })
      );

      const { error: tagLinkError } = await supabase
        .from("diary_tags")
        .insert(
          tagIds.map((tagId) => ({
            diary_id: createdDiaryId,
            tag_id: tagId,
          }))
        );

      if (tagLinkError) throw new Error(tagLinkError.message);
    }

    if (images.length > 0) {
      const { error: imageError } = await supabase.from("diary_images").insert(
        images.map((image) => ({
          diary_id: createdDiaryId,
          image_url: image.image_url,
          sort_order: image.sort_order,
          file_name: image.file_name,
          mime_type: image.mime_type,
          file_size: image.file_size,
        }))
      );

      if (imageError) throw new Error(imageError.message);
    }

    return createdDiaryId;
  } catch (error) {
    if (diaryId) {
      await supabase
        .from("diaries")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", diaryId)
        .eq("user_id", userId);
    }
    throw error;
  }
}

export async function createDiary(formData: FormData) {
  const supabase = await createClient();
  let uploadedImageUrls: string[] = [];

  try {
    const user = await getCurrentProfile();
    if (!user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const extractedData: CreateDiaryFormData = extractCreateDiaryFormData(formData);
    uploadedImageUrls = extractedData.imageUrls;

    const validationResult = await DiaryNewFormSchema.safeParseAsync({
      ...extractedData,
      images: uploadedImageUrls,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: "입력값을 다시 확인해주세요.",
        details: formatZodError(validationResult.error.format()),
      };
    }

    const images = buildDiaryImagePayloads(uploadedImageUrls);

    const { data: diaryId, error } = await supabase.rpc(
      "create_diary_transaction",
      {
        p_title: validationResult.data.title,
        p_content: validationResult.data.content,
        p_is_private: validationResult.data.isPrivate,
        p_emotion_ids: validationResult.data.emotions,
        p_tag_names: validationResult.data.tags,
        p_images: images as unknown as Json,
      }
    );

    const resolvedDiaryId =
      error && isMissingCreateDiaryRpc(error)
        ? await createDiaryWithoutRpc({
            supabase,
            userId: user.id,
            title: validationResult.data.title,
            content: validationResult.data.content,
            isPrivate: validationResult.data.isPrivate,
            emotionIds: validationResult.data.emotions,
            tagNames: validationResult.data.tags,
            images,
          })
        : diaryId;

    if (error && !isMissingCreateDiaryRpc(error)) {
      throw new Error(`일기 생성 실패: ${error.message}`);
    }

    if (!resolvedDiaryId) {
      throw new Error("일기 생성 실패: RPC 응답이 비어 있습니다.");
    }

    revalidateDiaryCreated({
      userId: user.id,
      diaryId: resolvedDiaryId,
      isPrivate: validationResult.data.isPrivate,
    });

    return { success: true, diary: { id: resolvedDiaryId } };
  } catch (error) {
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromS3(uploadedImageUrls);
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "일기 저장 중 오류가 발생했습니다.";

    console.error("일기 저장 중 오류:", errorMessage);

    return {
      success: false,
      error: errorMessage,
      details: "내용을 확인하고 다시 시도해주세요.",
    };
  }
}
