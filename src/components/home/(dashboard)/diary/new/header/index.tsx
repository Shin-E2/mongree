import {
  ButtonOptionDiaryNewPrev,
  ButtonOptionStandardSFull,
} from "@/commons/components/button-option";
import { ButtonTextWithCssprop } from "@/commons/components/button-text";
import { ChevronLeft, Globe, Lock } from "lucide-react";
import styles from "./styles.module.css";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";

export default function DiaryNewHeader() {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useFormContext<DiaryNewFormType>();

  const onSubmit = handleSubmit((data) => {
    console.log("Form submitted:", data);
  });

  const isPrivate = watch("isPrivate");
  const emotions = watch("emotions") || [];

  const handleTogglePublic = (value: boolean) => {
    setValue("isPrivate", value, { shouldValidate: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_margin_padding}>
        <div className={styles.header_context}>
          <ButtonOptionDiaryNewPrev
            title="돌아가기"
            icon={<ChevronLeft className={styles.header__back_button} />}
          />
          <div className={styles.header__buttons}>
            <div className={styles.header__buttons__isPrivate_button}>
              <ButtonOptionStandardSFull
                type="button"
                title="공개"
                icon={<Globe className={styles.header__buttons__icon_size} />}
                onClick={() => handleTogglePublic(true)}
                cssprop={
                  isPrivate
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
                  !isPrivate
                    ? styles.header__buttons_isPrivate_button_public
                    : styles.header__buttons_isPrivate_button_private
                }
              />
            </div>
            <ButtonTextWithCssprop
              type="button"
              title="등록하기"
              onClick={onSubmit}
              disabled={!isValid}
              cssprop={`${styles.header__buttons__public_submit_button} ${
                emotions.length > 0
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
