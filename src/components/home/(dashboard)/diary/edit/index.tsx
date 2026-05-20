"use client";

import { SmartModal } from "@/commons/components/modal";
import type { DiaryEditData } from "@/app/(dashboard)/diary/[id]/edit/action";
import { useDiaryEditForm } from "./hook";
import VisibilityField from "./visibility-field";
import EmotionField from "./emotion-field";
import TitleField from "./title-field";
import ContentField from "./content-field";
import TagField from "./tag-field";
import ImageField from "./image-field";
import FormActions from "./form-actions";
import styles from "./styles.module.css";

interface DiaryEditFormProps {
  diary: DiaryEditData;
}

export default function DiaryEditForm({ diary }: DiaryEditFormProps) {
  const editForm = useDiaryEditForm({ diary });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = editForm.form;

  return (
    <main className={styles.page}>
      <form
        className={styles.form}
        onSubmit={handleSubmit(editForm.submitDiary)}
      >
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={editForm.handleBack}
            disabled={editForm.isPending}
          >
            돌아가기
          </button>
          <div>
            <p className={styles.kicker}>일기 수정</p>
            <h1 className={styles.title}>오늘의 기록을 다시 다듬기</h1>
          </div>
        </header>

        <section className={styles.card}>
          <VisibilityField
            isPrivate={editForm.isPrivate}
            onChange={editForm.setPrivacy}
          />
          <EmotionField
            selectedEmotions={editForm.selectedEmotions}
            errorMessage={errors.emotions?.message}
            onToggle={editForm.toggleEmotion}
          />
          <TitleField
            register={register}
            errors={errors}
            titleLength={editForm.titleLength}
          />
          <ContentField
            register={register}
            errors={errors}
            contentLength={editForm.contentLength}
          />
          <TagField
            register={register}
            defaultValue={editForm.tagInputValue}
          />
          <ImageField imageState={editForm.imageState} />
        </section>

        <FormActions
          isPending={editForm.isPending}
          isValid={isValid}
          onCancel={editForm.handleBack}
        />
      </form>

      <SmartModal {...editForm.modalState} onClose={editForm.closeModal} />
    </main>
  );
}
