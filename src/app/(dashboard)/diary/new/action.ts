"use server";

import {
  deleteImagesFromS3,
  uploadMultipleImages,
} from "@/commons/utils/upload-images";
import { createClient } from "@/lib/supabase-server";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import { getUser } from "@/lib/get-user";
import { formatZodError } from "@/commons/utils/errorFormatters";
import { revalidateDiaryCreated } from "@/commons/utils/cache-revalidation";
import { processTagsAndGetIds } from "@/lib/diary/tags";

// 폼 데이터 추출 함수
function extractFormData(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const isPrivate = formData.get("isPrivate");
  const emotions = formData.getAll("emotions");
  const tags = formData.get("tags");
  const imageFiles = formData.getAll("images");

  if (!title || !content) {
    throw new Error("제목과 내용은 필수 입력사항입니다.");
  }

  const validImageFiles = imageFiles.filter((file): file is File => {
    return (
      file instanceof File &&
      (file.type === "image/jpeg" || file.type === "image/png")
    );
  });

  return {
    title: title.toString(),
    content: content.toString(),
    isPrivate: isPrivate === "true",
    emotions: emotions.map((e) => e.toString()),
    tags: tags ? tags.toString().split(",").filter(Boolean) : [],
    imageFiles: validImageFiles,
  };
}

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function cleanupDiaryData(supabase: SupabaseClient, diaryId: string, imageUrls: string[]): Promise<void> {
  try {
    // 이미지 파일 삭제 (S3)
    if (imageUrls.length > 0) {
      await deleteImagesFromS3(imageUrls);
    }

    // 일기 삭제 (CASCADE로 관련 데이터 자동 삭제)
    await supabase.from('diaries').delete().eq('id', diaryId);
    
  } catch (cleanupError) {
    console.error("데이터 정리 중 오류:", cleanupError);
  }
}

// 메인 일기 생성 함수 (이미지 우선 처리 방식)
export async function createDiary(formData: FormData) {
  const supabase = await createClient();

  try {
    const user = await getUser();
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    const extractedData = extractFormData(formData);

    // 🚀 1단계: 이미지 업로드 먼저 처리 (실패 확률 높음)
    let uploadedImageUrls: string[] = [];
    if (extractedData.imageFiles.length > 0) {
      uploadedImageUrls = await uploadMultipleImages(extractedData.imageFiles);
    }

    // 🔍 2단계: 데이터 검증
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
        error: "데이터 검증 실패",
        details: formatZodError(validationResult.error.format()),
      };
    }

    // 📝 3단계: 데이터베이스 작업 (순차 처리)
    const { data: newDiary, error: diaryError } = await supabase
      .from('diaries')
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

    // 감정 연결
    if (validationResult.data.emotions.length > 0) {
      const { error: emotionError } = await supabase
        .from('diary_emotions')
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

    // 태그 처리 및 연결
    if (validationResult.data.tags.length > 0) {
      const tagIds = await processTagsAndGetIds(supabase, validationResult.data.tags);
      
      if (tagIds.length > 0) {
        const { error: tagError } = await supabase
          .from('diary_tags')
          .insert(
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

    // 이미지 정보 저장
    if (uploadedImageUrls.length > 0) {
      const { error: imageError } = await supabase
        .from('diary_images')
        .insert(
          uploadedImageUrls.map((url, index) => ({
            diary_id: newDiary.id,
            image_url: url,
            sort_order: index + 1,
            file_name: extractedData.imageFiles[index]?.name || `image_${index + 1}`,
            mime_type: extractedData.imageFiles[index]?.type || 'image/jpeg',
            file_size: extractedData.imageFiles[index]?.size || null,
          }))
        );

      if (imageError) {
        await cleanupDiaryData(supabase, newDiary.id, uploadedImageUrls);
        throw new Error(`이미지 정보 저장 실패: ${imageError.message}`);
      }
    }

    // 성공 시 캐시 갱신
    revalidateDiaryCreated({
      userId: user.id,
      diaryId: newDiary.id,
      isPrivate: validationResult.data.isPrivate,
    });

    return { success: true, diary: newDiary };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("일기 저장 중 오류:", errorMessage);

    return {
      success: false,
      error: errorMessage,
      details: errorMessage,
    };
  }
}
