import type { SignupTempFormData } from "@/commons/constants/signup";
import type { ISignupStepProps } from "../step-progress-section/types";

export interface ISignupFormSteps {
  currentStep: number;
  setCurrentStep: (value: React.SetStateAction<number>) => void;
  currentStepData: ISignupStepProps;
  isLastStep: boolean;
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: any) => void;
  clearTempFormData: () => void;
  isEmailConfirmed: boolean;
}

export interface IuseSignupFormStepsProps {
  setCurrentStep: (value: React.SetStateAction<number>) => void;
  currentStepData: ISignupStepProps;
  initialFormData: SignupTempFormData;
}
