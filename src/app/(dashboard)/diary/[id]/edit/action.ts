"use server";

import {
  deleteImagesFromS3,
  uploadMultipleImages,
} from "@/commons/utils/upload-images";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

const MAX_DIARY_IMAGES = 3;

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

const parseEditFormData = (formData: FormData) => {
  const tags = formData.get("tags");
  const imageFiles = formData.getAll("images").filter((file): file is File => {
    return (
      file instanceof File &&
      (file.type === "image/jpeg" || file.type === "image/png")
    );
  });

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
    images: imageFiles,
    keptImageIds: formData
      .getAll("keptImageIds")
      .map((imageId) => imageId.toString()),
    removedImageIds: formData
      .getAll("removedImageIds")
      .map((imageId) => imageId.toString()),
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

  const { data: currentImages, error: imageFindError } = await supabase
    .from("diary_images")
    .select("id, image_url, sort_order")
    .eq("diary_id", diaryId)
    .order("sort_order", { ascending: true });

  if (imageFindError) {
    return {
      success: false,
      error: `이미지 조회 실패: ${imageFindError.message}`,
    };
  }

  const currentImageMap = new Map(
    (currentImages ?? []).map((image) => [image.id, image])
  );
  const keptImages = parsedData.keptImageIds
    .map((imageId) => currentImageMap.get(imageId))
    .filter((image): image is NonNullable<typeof image> => Boolean(image));
  const removedImages = parsedData.removedImageIds
    .map((imageId) => currentImageMap.get(imageId))
    .filter((image): image is NonNullable<typeof image> => Boolean(image));

  if (keptImages.length + parsedData.images.length > MAX_DIARY_IMAGES) {
    return {
      success: false,
      error: `이미지는 최대 ${MAX_DIARY_IMAGES}장까지 등록할 수 있습니다.`,
    };
  }

  let uploadedImageUrls: string[] = [];

  try {
    if (parsedData.images.length > 0) {
      uploadedImageUrls = await uploadMultipleImages(parsedData.images);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
    return { success: false, error: message };
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
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromS3(uploadedImageUrls);
    }
    return { success: false, error: `일기 수정 실패: ${diaryError.message}` };
  }

  const { error: deleteEmotionError } = await supabase
    .from("diary_emotions")
    .delete()
    .eq("diary_id", diaryId);

  if (deleteEmotionError) {
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromS3(uploadedImageUrls);
    }
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
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromS3(uploadedImageUrls);
    }
    return { success: false, error: `감정 수정 실패: ${emotionError.message}` };
  }

  const { error: deleteTagError } = await supabase
    .from("diary_tags")
    .delete()
    .eq("diary_id", diaryId);

  if (deleteTagError) {
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromS3(uploadedImageUrls);
    }
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
      if (uploadedImageUrls.length > 0) {
        await deleteImagesFromS3(uploadedImageUrls);
      }
      return { success: false, error: `태그 수정 실패: ${tagError.message}` };
    }
  }

  if (removedImages.length > 0) {
    const { error: deleteImageRowError } = await supabase
      .from("diary_images")
      .delete()
      .in(
        "id",
        removedImages.map((image) => image.id)
      );

    if (deleteImageRowError) {
      if (uploadedImageUrls.length > 0) {
        await deleteImagesFromS3(uploadedImageUrls);
      }
      return {
        success: false,
        error: `이미지 삭제 실패: ${deleteImageRowError.message}`,
      };
    }
  }

  for (const [index, image] of keptImages.entries()) {
    const { error: sortError } = await supabase
      .from("diary_images")
      .update({ sort_order: index + 1 })
      .eq("id", image.id)
      .eq("diary_id", diaryId);

    if (sortError) {
      if (uploadedImageUrls.length > 0) {
        await deleteImagesFromS3(uploadedImageUrls);
      }
      return {
        success: false,
        error: `이미지 순서 저장 실패: ${sortError.message}`,
      };
    }
  }

  if (uploadedImageUrls.length > 0) {
    const { error: insertImageError } = await supabase
      .from("diary_images")
      .insert(
        uploadedImageUrls.map((url, index) => ({
          diary_id: diaryId,
          image_url: url,
          sort_order: keptImages.length + index + 1,
          file_name: parsedData.images[index]?.name ?? `image_${index + 1}`,
          mime_type: parsedData.images[index]?.type ?? "image/jpeg",
          file_size: parsedData.images[index]?.size ?? null,
        }))
      );

    if (insertImageError) {
      await deleteImagesFromS3(uploadedImageUrls);
      return {
        success: false,
        error: `이미지 정보 저장 실패: ${insertImageError.message}`,
      };
    }
  }

  if (removedImages.length > 0) {
    try {
      await deleteImagesFromS3(removedImages.map((image) => image.image_url));
    } catch (error) {
      console.error("삭제된 이미지 파일 정리 실패:", error);
    }
  }

  revalidatePath("/diary");
  revalidatePath(`/diary/${diaryId}`);
  revalidatePath("/home");

  return { success: true };
}
