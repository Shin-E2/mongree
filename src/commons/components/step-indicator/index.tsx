import type {
  IStepIndicatorBaseProps,
  IStepIndicatorStandardMMProps,
} from "./types";
import styles from "./styles.module.css";

export function StepIndicatorBase({
  label,
  step,
  currentStep,
  cssprop,
}: IStepIndicatorBaseProps) {
  // 현재 단계이거나 이전 단계인 경우 활성화
  const isActive = currentStep >= step;

  return (
    <div
      className={`${styles.common} ${
        isActive ? styles.activeText : styles.inactiveText
      }`}
    >
      {/* 현재 단계 */}
      <div
        className={`${cssprop} ${
          isActive ? styles.activeCircle : styles.inactiveCircle
        }`}
      >
        {step}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export const StepIndicatorStandardMM = ({
  ...rest
}: IStepIndicatorStandardMMProps) => {
  return <StepIndicatorBase {...rest} cssprop={styles.standard__m__m} />;
};
