export interface ISignupStepBasicInfoProps {
  //useActionState의 state 타입
  state?: any;
  onNicknameChecked?: (v: boolean) => void;
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: Partial<SignupFormType>) => void;
  isEmailVerified: boolean;
}

export interface IcheckPasswordsProps {
  password: string;
  passwordConfirm: string;
}
