import { SignupTempFormData } from "@/commons/constants/signup";
import { SignupFormType } from "./form.schema";

export interface ISignupStepBasicInfoProps {
  state?: unknown;
  onNicknameChecked?: (v: boolean) => void;
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: Partial<SignupFormType>) => void;
  isEmailVerified: boolean;
}

export interface IcheckPasswordsProps {
  password: string;
  passwordConfirm: string;
}
