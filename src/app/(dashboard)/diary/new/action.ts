"use server";

import {
  deleteImagesFromS3,
  uploadMultipleImages,
} from "@/commons/utils/upload-images";
import { createClient } from "@/lib/supabase-server";
import {
  DIARY_IMAGE_ACCEPTED_TYPES,
  DIARY_IMAGE_MAX_COUNT,
  DiaryNewFormSchema,
} from "@/components/home/(dashboard)/diary/new/form.schema";
import { getUser } from "@/lib/get-user";
import { formatZodError } from "@/commons/utils/errorFormatters";
import { revalidateDiaryCreated } from "@/commons/utils/cache-revalidation";
import { processTagsAndGetIds } from "@/lib/diary/tags";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function extractFormData(formData: FormData) {
  const imageFiles = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  const invalidImage = imageFiles.find(
    (file) => !DIARY_IMAGE_ACCEPTED_TYPES.includes(file.type)
  );

  if (invalidImage) {
    throw new Error("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
  }

  if (imageFiles.length > DIARY_IMAGE_MAX_COUNT) {
    throw new Error(`이미지는 최대 ${DIARY_IMAGE_MAX_COUNT}개까지 등록할 수 있습니다.`);
  }

  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    isPrivate: formData.get("isPrivate") === "true",
    emotions: formData.getAll("emotions").map((emotion) => String(emotion)),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    imageFiles,
  };
}

async function cleanupDiaryData(
  supabase: SupabaseClient,
  diaryId: string,
  imageUrls: string[]
): Promise<void> {
  try {
    if (imageUrls.length > 0) {
      await deleteImagesFromS3(imageUrls);
    }

    await supabase.from("diaries").delete().eq("id", diaryId);
  } catch (cleanupError) {
    console.error("일기 저장 실패 후 정리 중 오류:", cleanupError);
  }
}

export async function createDiary(formData: FormData) {
  const supabase = await createClient();
  let uploadedImageUrls: string[] = [];

  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const extractedData = extractFormData(formData);

    if (extractedData.imageFiles.length > 0) {
      uploadedImageUrls = await uploadMultipleImages(extractedData.imageFiles);
    }

    const validationResult = await DiaryNewFormSchema.safeParseAsync({
      ...extractedData,
      images: uploadedImageUrls,
    });

    if (!validationResult.success) {
      if (uploadedImageUrls.length > 0) {
        await deleteImagesFromS3(uploadedImageUrls);
      }

      return {
        success: false,
        error: "입력값을 다시 확인해주세요.",
        details: formatZodError(validationResult.error.format()),
      };
    }

    const { data: newDiary, error: diaryError } = await supabase
      .from("diaries")
      .insert({
        title: validationResult.data.title,
        content: validationResult.data.content,
        is_private: validationResult.data.isPrivate,
        user_id: user.id,
      })
      .select()
      .single();

    if (diaryError) {
      if (uploadedImageUrls.length > 0) {
        await deleteImagesFromS3(uploadedImageUrls);
      }
      throw new Error(`일기 생성 실패: ${diaryError.message}`);
    }

    if (validationResult.data.emotions.length > 0) {
      const { error: emotionError } = await supabase
        .from("diary_emotions")
        .insert(
          validationResult.data.emotions.map((emotionId) => ({
            diary_id: newDiary.id,
            emotion_id: emotionId,
          }))
        );

      if (emotionError) {
        await cleanupDiaryData(supabase, newDiary.id, uploadedImageUrls);
        throw new Error(`감정 연결 실패: ${emotionError.message}`);
      }
    }

    if (validationResult.data.tags.length > 0) {
      const tagIds = await processTagsAndGetIds(
        supabase,
        validationResult.data.tags
      );

      if (tagIds.length > 0) {
        const { error: tagError } = await supabase.from("diary_tags").insert(
          tagIds.map((tagId) => ({
            diary_id: newDiary.id,
            tag_id: tagId,
          }))
        );

        if (tagError) {
          await cleanupDiaryData(supabase, newDiary.id, uploadedImageUrls);
          throw new Error(`태그 연결 실패: ${tagError.message}`);
        }
      }
    }

    if (uploadedImageUrls.length > 0) {
      const { error: imageError } = await supabase.from("diary_images").insert(
        uploadedImageUrls.map((url, index) => ({
          diary_id: newDiary.id,
          image_url: url,
          sort_order: index + 1,
          file_name: extractedData.imageFiles[index]?.name || `image_${index + 1}`,
          mime_type: extractedData.imageFiles[index]?.type || "image/jpeg",
          file_size: extractedData.imageFiles[index]?.size || null,
        }))
      );

      if (imageError) {
        await cleanupDiaryData(supabase, newDiary.id, uploadedImageUrls);
        throw new Error(`이미지 정보 저장 실패: ${imageError.message}`);
      }
    }

    revalidateDiaryCreated({
      userId: user.id,
      diaryId: newDiary.id,
      isPrivate: validationResult.data.isPrivate,
    });

    return { success: true, diary: newDiary };
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
      details: "내용을 확인한 뒤 다시 시도해주세요.",
    };
  }
}
