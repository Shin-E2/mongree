"use client";

import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { SmartModal } from "@/commons/components/modal";
import { ModalType } from "@/commons/components/modal/types";
import {
  DIARY_CONTENT_MAX_LENGTH,
  DIARY_TITLE_MAX_LENGTH,
  DiaryNewFormSchema,
  type DiaryNewFormType,
} from "@/components/home/(dashboard)/diary/new/form.schema";
import { EMOTIONS } from "@/mock/emotions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type {
  DiaryEditData,
  DiaryEditImage,
} from "@/app/(dashboard)/diary/[id]/edit/action";
import { updateDiary } from "@/app/(dashboard)/diary/[id]/edit/action";
import styles from "./styles.module.css";

const MAX_IMAGE_COUNT = 3;

interface DiaryEditFormProps {
  diary: DiaryEditData;
}

interface NewImagePreview {
  file: File;
  previewUrl: string;
}

export default function DiaryEditForm({ diary }: DiaryEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [existingImages, setExistingImages] = useState<DiaryEditImage[]>(
    diary.images
  );
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const newImagesRef = useRef<NewImagePreview[]>([]);
  const [imageError, setImageError] = useState("");
  const [modalState, setModalState] = useState({
    type: null as ModalType | null,
    isOpen: false,
    message: "",
    details: undefined as string | undefined,
  });

  useEffect(() => {
    newImagesRef.current = newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      newImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.previewUrl)
      );
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiaryNewFormType>({
    resolver: zodResolver(DiaryNewFormSchema),
    mode: "onChange",
    defaultValues: {
      isPrivate: diary.isPrivate,
      emotions: diary.emotions,
      title: diary.title,
      content: diary.content,
      tags: diary.tags,
      images: [],
    },
  });

  const selectedEmotions = watch("emotions") ?? [];
  const isPrivate = watch("isPrivate");
  const titleLength = watch("title")?.length ?? 0;
  const contentLength = watch("content")?.length ?? 0;

  const tagInputValue = useMemo(() => diary.tags.join(", "), [diary.tags]);
  const imageCount = existingImages.length + newImages.length;

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, type: null }));
  };

  const toggleEmotion = (emotionId: string) => {
    const nextEmotions = selectedEmotions.includes(emotionId)
      ? selectedEmotions.filter((id) => id !== emotionId)
      : [...selectedEmotions, emotionId];

    setValue("emotions", nextEmotions, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
    setRemovedImageIds((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId]
    );
    setImageError("");
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
    setImageError("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    if (imageCount + files.length > MAX_IMAGE_COUNT) {
      setImageError(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`);
      event.target.value = "";
      return;
    }

    const supportedFiles = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (supportedFiles.length !== files.length) {
      setImageError("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setNewImages((prev) => [
      ...prev,
      ...supportedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    setImageError("");
    event.target.value = "";
  };

  const onSubmit = (data: DiaryNewFormType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("isPrivate", String(data.isPrivate));
    data.emotions.forEach((emotionId) => formData.append("emotions", emotionId));
    formData.append("tags", data.tags?.join(",") ?? "");
    existingImages.forEach((image) => formData.append("keptImageIds", image.id));
    removedImageIds.forEach((imageId) =>
      formData.append("removedImageIds", imageId)
    );
    newImages.forEach((image) => formData.append("images", image.file));

    startTransition(async () => {
      const result = await updateDiary(diary.id, formData);

      if (result.success) {
        router.push(`/diary/${diary.id}`);
        router.refresh();
        return;
      }

      setModalState({
        type: ModalType.ERROR_WARNING,
        isOpen: true,
        message: result.error ?? "일기 수정에 실패했습니다.",
        details: undefined,
      });
    });
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.back()}
          >
            돌아가기
          </button>
          <div>
            <p className={styles.kicker}>일기 수정</p>
            <h1 className={styles.title}>오늘의 기록을 다시 다듬기</h1>
          </div>
        </header>

        <section className={styles.card}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>공개 여부</label>
            <div className={styles.segmented}>
              <button
                type="button"
                className={`${styles.segmentButton} ${
                  isPrivate ? styles.segmentButtonActive : ""
                }`}
                onClick={() => setValue("isPrivate", true, { shouldDirty: true })}
              >
                비공개
              </button>
              <button
                type="button"
                className={`${styles.segmentButton} ${
                  !isPrivate ? styles.segmentButtonActive : ""
                }`}
                onClick={() =>
                  setValue("isPrivate", false, { shouldDirty: true })
                }
              >
                공개
              </button>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>감정</label>
            <div className={styles.emotionGrid}>
              {EMOTIONS.map((emotion) => (
                <ButtonOptionEmotion
                  key={emotion.id}
                  emotion={emotion}
                  isSelected={selectedEmotions.includes(emotion.id)}
                  onClick={() => toggleEmotion(emotion.id)}
                  type="button"
                />
              ))}
            </div>
            {errors.emotions?.message && (
              <p className={styles.errorText}>{errors.emotions.message}</p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="title">
              제목
            </label>
            <input
              id="title"
              className={styles.titleInput}
              placeholder="제목을 입력하세요"
              {...register("title")}
            />
            <div className={styles.helperRow}>
              <span className={errors.title?.message ? styles.errorText : styles.helperText}>
                {errors.title?.message ?? "짧게 기억할 수 있는 제목"}
              </span>
              <span
                className={
                  titleLength > DIARY_TITLE_MAX_LENGTH
                    ? styles.countTextError
                    : styles.countText
                }
              >
                {titleLength}/{DIARY_TITLE_MAX_LENGTH}
              </span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="content">
              내용
            </label>
            <textarea
              id="content"
              className={styles.contentTextarea}
              placeholder="오늘 하루는 어땠나요?"
              {...register("content")}
            />
            <div className={styles.helperRow}>
              <span className={errors.content?.message ? styles.errorText : styles.helperText}>
                {errors.content?.message ?? "길게 써도 괜찮아요"}
              </span>
              <span
                className={
                  contentLength > DIARY_CONTENT_MAX_LENGTH
                    ? styles.countTextError
                    : styles.countText
                }
              >
                {contentLength.toLocaleString()}/
                {DIARY_CONTENT_MAX_LENGTH.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="tags">
              태그
            </label>
            <input
              id="tags"
              className={styles.textInput}
              placeholder="쉼표로 구분해서 입력하세요"
              defaultValue={tagInputValue}
              {...register("tags")}
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.imageHeader}>
              <label className={styles.label}>이미지</label>
              <span className={styles.imageCount}>
                {imageCount}/{MAX_IMAGE_COUNT}
              </span>
            </div>
            <div className={styles.imageGrid}>
              {existingImages.map((image) => (
                <div key={image.id} className={styles.imageItem}>
                  <Image
                    src={image.url}
                    alt="기존 일기 이미지"
                    width={160}
                    height={160}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.imageDeleteButton}
                    onClick={() => handleRemoveExistingImage(image.id)}
                    aria-label="기존 이미지 삭제"
                  >
                    <X className={styles.imageDeleteIcon} />
                  </button>
                </div>
              ))}

              {newImages.map((image, index) => (
                <div key={image.previewUrl} className={styles.imageItem}>
                  <Image
                    src={image.previewUrl}
                    alt="새 일기 이미지"
                    width={160}
                    height={160}
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    className={styles.imageDeleteButton}
                    onClick={() => handleRemoveNewImage(index)}
                    aria-label="새 이미지 삭제"
                  >
                    <X className={styles.imageDeleteIcon} />
                  </button>
                </div>
              ))}

              {imageCount < MAX_IMAGE_COUNT && (
                <label className={styles.imageAddButton} htmlFor="diary-images">
                  <ImagePlus className={styles.imageAddIcon} />
                  <span>이미지 추가</span>
                </label>
              )}
            </div>
            <input
              id="diary-images"
              className={styles.fileInput}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleImageChange}
            />
            {imageError && <p className={styles.errorText}>{imageError}</p>}
            <p className={styles.imageNotice}>
              기존 이미지는 삭제할 수 있고, 새 이미지는 총 {MAX_IMAGE_COUNT}장까지
              추가할 수 있습니다.
            </p>
          </div>
        </section>

        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => router.back()}
          >
            취소
          </button>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "저장 중" : "수정 완료"}
          </button>
        </div>
      </form>

      <SmartModal {...modalState} onClose={closeModal} />
    </main>
  );
}
