import { SignupTempFormData } from "@/commons/constants/signup";

export interface SignupStepBasicInfoEmailContainerProps {
  initialFormData: SignupTempFormData;
  saveTempFormData: () => void;
  isEmailVerified: boolean;
}

export interface EmailVerificationState {
  isVerifying: boolean;
  successMessage: string;
}
