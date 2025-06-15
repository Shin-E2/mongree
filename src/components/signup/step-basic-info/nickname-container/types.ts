import { SignupTempFormData } from "@/app/(auth)/signup/hook";
import { SignupFormType } from "../form.schema";

export interface SignupStepBasicInfoNicknameContainerProps {
  onCheckSuccess?: (v: boolean) => void;
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: Partial<SignupFormType>) => void;
}

export interface NicknameCheckState {
  isChecking: boolean;
  successMessage: string;
  isChecked: boolean;
} 