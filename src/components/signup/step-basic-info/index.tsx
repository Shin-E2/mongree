import { InputFieldStandardSFull } from "@/commons/components/input-field";
import styles from "./styles.module.css";
import SignupStepBasicInfoNicknameContainer from "./nickname-container";
import SignupStepBasicInfoEmailContainer from "./email-container";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { SignupFormType } from "./form.schema";
import { SignupTempFormData } from "@/app/(auth)/signup/hook";

interface SignupStepBasicInfoProps {
  onNicknameChecked?: (v: boolean) => void;
  initialFormData: SignupTempFormData;
  saveTempFormData: (data: Partial<SignupFormType>) => void;
  isEmailVerified: boolean;
}

export default function SignupStepBasicInfo({
  onNicknameChecked,
  initialFormData,
  saveTempFormData,
  isEmailVerified,
}: SignupStepBasicInfoProps) {
  const { setValue, getValues } = useFormContext<SignupFormType>();

  useEffect(() => {
    if (initialFormData) {
      for (const key in initialFormData) {
        if (Object.prototype.hasOwnProperty.call(initialFormData, key)) {
          const value = initialFormData[key as keyof SignupTempFormData];
          if (typeof value === "object" && value !== null) {
            for (const subKey in value) {
              if (Object.prototype.hasOwnProperty.call(value, subKey)) {
                setValue(
                  `${key}.${subKey}` as any,
                  value[subKey as keyof typeof value]
                );
              }
            }
          } else if (value !== undefined) {
            setValue(key as any, value);
          }
        }
      }
    }
  }, [initialFormData, setValue]);

  // 이메일 인증 버튼 클릭 전에 현재 폼 데이터 저장
  const handleSaveFormDataBeforeEmailVerify = () => {
    saveTempFormData(getValues());
  };

  return (
    <section className={styles.section}>
      {/* 이름, 닉네임 */}
      <div className={styles.section_div}>
        {/* 이름 입력 필드 */}
        <InputFieldStandardSFull
          name="name"
          title="이름"
          placeholder="이름을 입력해주세요"
          required
        />

        {/* 닉네임 입력 영역 */}
        <SignupStepBasicInfoNicknameContainer
          onCheckSuccess={onNicknameChecked}
          initialFormData={initialFormData}
          saveTempFormData={saveTempFormData}
        />
      </div>

      {/* 이메일 */}
      <SignupStepBasicInfoEmailContainer
        initialFormData={initialFormData}
        saveTempFormData={handleSaveFormDataBeforeEmailVerify}
        isEmailVerified={isEmailVerified}
      />

      {/* 비밀번호 */}
      <InputFieldStandardSFull
        name="password"
        title="비밀번호"
        type="password"
        placeholder="영문, 숫자, 특수문자 포함 8자 이상"
        required
      />
      <InputFieldStandardSFull
        name="passwordConfirm"
        title="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        required
      />

      {/* 주소 입력 */}
      <InputFieldStandardSFull name="address" title="주소" isAddress />
    </section>
  );
}
