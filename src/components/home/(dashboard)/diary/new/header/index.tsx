import {
  ButtonOptionDiaryNewPrev,
  ButtonOptionStandardSFull,
} from "@/commons/components/button-option";
import { ButtonTextWithCssprop } from "@/commons/components/button-text";
import { ChevronLeft, Globe, Lock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";
import styles from "./styles.module.css";

interface DiaryNewHeaderProps {
  isSubmitting: boolean;
}

export default function DiaryNewHeader({ isSubmitting }: DiaryNewHeaderProps) {
  const { watch, setValue } = useFormContext<DiaryNewFormType>();

  const title = watch("title");
  const content = watch("content");
  const isPrivate = watch("isPrivate");
  const emotions = watch("emotions") || [];

  const canSubmit = emotions.length > 0 && Boolean(title) && Boolean(content);

  const handleTogglePublic = (isPublic: boolean) => {
    setValue("isPrivate", !isPublic, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_margin_padding}>
        <div className={styles.header_context}>
          <ButtonOptionDiaryNewPrev
            title="돌아가기"
            icon={<ChevronLeft className={styles.header__back_button} />}
            onClick={() => window.history.back()}
          />
          <div className={styles.header__buttons}>
            <div className={styles.header__buttons__isPrivate_button}>
              <ButtonOptionStandardSFull
                type="button"
                title="공개"
                icon={<Globe className={styles.header__buttons__icon_size} />}
                onClick={() => handleTogglePublic(true)}
                cssprop={
                  !isPrivate
                    ? styles.header__buttons_isPrivate_button_public
                    : styles.header__buttons_isPrivate_button_private
                }
              />
              <ButtonOptionStandardSFull
                type="button"
                title="비공개"
                icon={<Lock className={styles.header__buttons__icon_size} />}
                onClick={() => handleTogglePublic(false)}
                cssprop={
                  isPrivate
                    ? styles.header__buttons_isPrivate_button_public
                    : styles.header__buttons_isPrivate_button_private
                }
              />
            </div>
            <ButtonTextWithCssprop
              type="submit"
              title={isSubmitting ? "저장 중..." : "등록하기"}
              disabled={!canSubmit || isSubmitting}
              cssprop={`${styles.header__buttons__public_submit_button} ${
                canSubmit && !isSubmitting
                  ? styles.header__buttons__selected
                  : styles.header__buttons__not_selected
              }`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
