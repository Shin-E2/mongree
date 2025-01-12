import { ButtonTextWithMarginLeftSS } from "@/commons/components/button-text";
import styles from "./styles.module.css";
import type { ISignupSectionButtonProps } from "./types";

export default function SignupSectionButton({
  currentStep,
  handlePrev,
  isLastStep,
  handleNext,
}: ISignupSectionButtonProps) {
  return (
    <div className={styles.div}>
      {currentStep > 0 && (
        <ButtonTextWithMarginLeftSS
          type="button"
          onClick={handlePrev}
          title="이전"
        />
      )}

      <ButtonTextWithMarginLeftSS
        type={isLastStep ? "submit" : "button"}
        className={currentStep === 0 ? "ml-auto" : ""} // 동적으로 스타일을 적용하기 위한 className
        title={isLastStep ? "가입완료" : "다음"}
        onClick={!isLastStep ? handleNext : undefined} // 마지막 단계에서는 onClick을 제거
      />
    </div>
  );
}
