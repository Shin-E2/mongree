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
        isActive ? "text-indigo-600" : "text-gray-400"
      }`}
    >
      {/* 현재 단계 */}
      <div
        className={`${cssprop} ${
          isActive ? "bg-indigo-600 text-white" : "bg-gray-200"
        }`}
      >
        {step}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export const StepIndicatorStandardMM = ({
  ...rest
}: IStepIndicatorStandardMMProps) => {
  return <StepIndicatorBase {...rest} cssprop={styles.standard__m__m} />;
};
