import { SignupTempFormData } from "@/commons/constants/signup";
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
