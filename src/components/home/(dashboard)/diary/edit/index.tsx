"use client";

import { ButtonOptionEmotion } from "@/commons/components/button-option";
import { SmartModal } from "@/commons/components/modal";
import { ModalType } from "@/commons/components/modal/types";
import { DiaryNewFormSchema } from "@/components/home/(dashboard)/diary/new/form.schema";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";
import { EMOTIONS } from "@/mock/emotions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { DiaryEditData } from "@/app/(dashboard)/diary/[id]/edit/action";
import { updateDiary } from "@/app/(dashboard)/diary/[id]/edit/action";
import styles from "./styles.module.css";

interface DiaryEditFormProps {
  diary: DiaryEditData;
}

export default function DiaryEditForm({ diary }: DiaryEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalState, setModalState] = useState({
    type: null as ModalType | null,
    isOpen: false,
    message: "",
    details: undefined as string | undefined,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiaryNewFormType>({
    resolver: zodResolver(DiaryNewFormSchema),
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

  const tagInputValue = useMemo(() => diary.tags.join(", "), [diary.tags]);

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

  const onSubmit = (data: DiaryNewFormType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("isPrivate", String(data.isPrivate));
    data.emotions.forEach((emotionId) => formData.append("emotions", emotionId));
    formData.append("tags", data.tags?.join(",") ?? "");

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
            {errors.title?.message && (
              <p className={styles.errorText}>{errors.title.message}</p>
            )}
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
            {errors.content?.message && (
              <p className={styles.errorText}>{errors.content.message}</p>
            )}
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

          <p className={styles.imageNotice}>
            첨부된 이미지는 그대로 유지됩니다.
          </p>
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
