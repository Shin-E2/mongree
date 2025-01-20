import type { ISignupStepProps } from "../step-progress-section/types";

export interface ISignupFormSteps {
  currentStep: number;
  setCurrentStep: (value: React.SetStateAction<number>) => void;
  currentStepData: ISignupStepProps;
  isLastStep: boolean;
}

export interface IuseSignupFormStepsProps
  extends Omit<ISignupFormSteps, "isLastStep" | "currentStep"> {}
