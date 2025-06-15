import { SignupTempFormData } from "@/app/(auth)/signup/hook";
import { SignupFormType } from "../form.schema";

export interface SignupStepBasicInfoEmailContainerProps {
  initialFormData: SignupTempFormData;
  saveTempFormData: () => void;
  isEmailVerified: boolean;
}

export interface EmailVerificationState {
  isVerifying: boolean;
  successMessage: string;
}
