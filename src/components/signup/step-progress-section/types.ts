import React from "react";
import { SignupTempFormData } from "@/commons/constants/signup";
import { SignupFormType } from "../step-basic-info/form.schema";

export interface ISignupStepComponentProps {
  onNicknameChecked?: (v: boolean) => void;
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: Partial<SignupFormType>) => void;
  isEmailVerified: boolean;
}

export interface ISignupStepProps {
  id: number;
  label: string;
  Component: React.ComponentType<ISignupStepComponentProps>;
  fields: string[];
}

export interface IstepProgressSectionProps {
  progress: number;
  currentStepData: {
    id: number;
    label: string;
  };
}
