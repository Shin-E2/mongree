import {
  ButtonIconNext,
  ButtonIconPrev,
} from "@/commons/components/button-icon";
import { ButtonTextWithMarginLeftSS } from "@/commons/components/button-text";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";
import styles from "./styles.module.css";

export interface IDiaryNewSectionButton {
  currentStep: number;
  handleNext: () => void;
  handlePrev: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export default function DiaryNewSectionButton({
  currentStep,
  handleNext,
  handlePrev,
  isLastStep,
  isSubmitting,
}: IDiaryNewSectionButton) {
  const { watch } = useFormContext<DiaryNewFormType>();
  const emotions = watch("emotions") || [];

  return (
    <div className={styles.buttonContainer}>
      {currentStep > 0 && <ButtonIconPrev onClick={handlePrev} type="button" />}
      {!isLastStep && emotions.length > 0 && (
        <ButtonIconNext
          onClick={handleNext}
          type="button"
          disabled={isSubmitting}
        />
      )}
      {isLastStep && (
        <ButtonTextWithMarginLeftSS
          type="submit"
          title={isSubmitting ? "저장 중..." : "저장하기"}
          disabled={isSubmitting}
        />
      )}
    </div>
  );
}
