export interface IStepIndicatorBaseProps {
  label: string;
  step: number;
  currentStep: number;
  cssprop: string;
}

export interface IStepIndicatorStandardMMProps
  extends Omit<IStepIndicatorBaseProps, "cssprop"> {}
