import {
  ButtonOptionDiaryNewPrev,
  ButtonOptionStandardSFull,
} from "@/commons/components/button-option";
import { ButtonTextWithCssprop } from "@/commons/components/button-text";
import { ChevronLeft, Globe, Lock } from "lucide-react";
import styles from "./styles.module.css";

interface IDiaryNewHeaderProps {
  setIsPublic: (isPublic: boolean) => void;
  isPublic: boolean;
  selectedEmotions: string[];
}

export default function DiaryNewHeader({
  setIsPublic,
  isPublic,
  selectedEmotions,
}: IDiaryNewHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.header_margin_padding}>
        <div className={styles.header_context}>
          <ButtonOptionDiaryNewPrev
            title="돌아가기"
            icon={<ChevronLeft className={styles.header__back_button} />}
          />
          <div className={styles.header__buttons}>
            {/*  공개 비공개 선택 */}
            <div className={styles.header__buttons__isPrivate_button}>
              <ButtonOptionStandardSFull
                title="공개"
                icon={<Globe className={styles.header__buttons__icon_size} />}
                onClick={() => setIsPublic(true)}
                cssprop={` ${
                  isPublic
                    ? styles.header__buttons_isPrivate_button_public
                    : styles.header__buttons_isPrivate_button_private
                }`}
              />
              <ButtonOptionStandardSFull
                title="비공개"
                icon={<Lock className={styles.header__buttons__icon_size} />}
                onClick={() => setIsPublic(false)}
                cssprop={`${
                  !isPublic
                    ? styles.header__buttons_isPrivate_button_public
                    : styles.header__buttons_isPrivate_button_private
                }`}
              />
            </div>
            {/* 등록하기 버튼 */}
            <ButtonTextWithCssprop
              title="등록하기"
              disabled={selectedEmotions.length === 0}
              cssprop={` ${styles.header__buttons__public_submit_button} ${
                selectedEmotions.length > 0
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
