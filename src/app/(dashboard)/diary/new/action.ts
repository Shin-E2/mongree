"use server";

import {
  deleteImagesFromS3,
  uploadMultipleImages,
} from "@/commons/utils/upload-images";
import db from "@/lib/db";
import { getUser } from "@/lib/get-user";
import type { CreateDiaryRelationsParams } from "./types";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";

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

  // 이미지 파일 유효성 검사 추가
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

// 관계 데이터를 저장하는 함수
async function createDiaryRelations({
  tx,
  diaryId,
  data,
}: CreateDiaryRelationsParams) {
  // 이미지 정보 저장
  const imagePromises =
    data.images?.map((url, index) =>
      tx.diaryImage.create({
        data: { url, order: index, diaryId },
      })
    ) ?? [];

  // 감정 연결
  const emotionPromises = data.emotions.map((emotionId) =>
    tx.diaryEmotion.create({
      data: { diaryId, emotionId },
    })
  );

  // 태그 처리
  const tagPromises = data.tags.map(async (tagName) => {
    const tag = await tx.tag.upsert({
      where: { name: tagName },
      create: { name: tagName },
      update: {},
    });

    return tx.diaryTag.create({
      data: { diaryId, tagId: tag.id },
    });
  });

  await Promise.all([...imagePromises, ...emotionPromises, ...tagPromises]);
}

// 일기 생성을 처리하는 메인 함수
export async function createDiary(formData: FormData) {
  let uploadedImageUrls: string[] = [];

  try {
    const user = await getUser();
    const extractedData = extractFormData(formData);

    const diary = await db.$transaction(async (tx) => {
      // 1. 이미지 업로드
      if (extractedData.imageFiles.length > 0) {
        uploadedImageUrls = await uploadMultipleImages(
          extractedData.imageFiles
        );
      }

      // 2. 데이터 검증
      const validationResult = await DiaryNewFormSchema.safeParseAsync({
        ...extractedData,
        images: uploadedImageUrls,
      });

      if (!validationResult.success) {
        throw new Error("데이터 검증 실패");
      }

      // 3. 먼저 일기 기본 정보 생성
      const newDiary = await tx.diary.create({
        data: {
          title: validationResult.data.title,
          content: validationResult.data.content,
          isPrivate: validationResult.data.isPrivate,
          userId: user.id,
        },
      });

      // 4. 일기가 생성된 후에 이미지 정보 저장
      if (uploadedImageUrls.length > 0) {
        await Promise.all(
          uploadedImageUrls.map((url, index) =>
            tx.diaryImage.create({
              data: {
                url,
                order: index,
                diaryId: newDiary.id, // 생성된 일기의 ID 사용
              },
            })
          )
        );
      }

      // 5. 감정 연결
      await Promise.all(
        validationResult.data.emotions.map((emotionId) =>
          tx.diaryEmotion.create({
            data: {
              diaryId: newDiary.id,
              emotionId,
            },
          })
        )
      );

      // 6. 태그 처리
      if (validationResult.data.tags.length > 0) {
        await Promise.all(
          validationResult.data.tags.map(async (tagName) => {
            const tag = await tx.tag.upsert({
              where: { name: tagName },
              create: { name: tagName },
              update: {},
            });

            return tx.diaryTag.create({
              data: {
                diaryId: newDiary.id,
                tagId: tag.id,
              },
            });
          })
        );
      }

      // 7. 생성된 일기 반환
      return newDiary;
    });

    console.log("일기 저장 성공");
    return { success: true, diary };
  } catch (error) {
    // 에러 발생 시 이미지 정리
    if (uploadedImageUrls.length > 0) {
      await deleteImagesFromS3(uploadedImageUrls);
    }

    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
    console.error("일기 저장 중 오류:", { message: errorMessage });

    return {
      success: false,
      error: "일기 저장에 실패했습니다",
      details: errorMessage,
    };
  }
}
