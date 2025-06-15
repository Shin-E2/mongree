import { InputFieldStandardSFull } from "@/commons/components/input-field";
import { ButtonTextWithPaddingMM } from "@/commons/components/button-text";
import { useEmailVerification } from "./hook";
import { type SignupStepBasicInfoEmailContainerProps } from "./types";
import styles from "./styles.module.css";

export default function SignupStepBasicInfoEmailContainer({
  initialFormData,
  saveTempFormData,
  isEmailVerified,
}: SignupStepBasicInfoEmailContainerProps) {
  const { emailValue, state, handleVerifyEmail, register, errors } =
    useEmailVerification({ initialFormData });

  const handleClickVerify = async () => {
    saveTempFormData();
    await handleVerifyEmail();
  };

  return (
    <div>
      <section className={styles.container}>
        <div className={styles.inputWrapper}>
          <InputFieldStandardSFull
            name="email"
            title="이메일"
            type="email"
            placeholder="이메일을 입력해주세요"
            required
            register={register}
            disabled={isEmailVerified}
          />
        </div>
        <ButtonTextWithPaddingMM
          title={
            isEmailVerified
              ? "인증 완료"
              : state.isVerifying
              ? "발송중..."
              : "인증하기"
          }
          type="button"
          onClick={handleClickVerify}
          disabled={
            !emailValue ||
            !!errors.email ||
            state.isVerifying ||
            isEmailVerified
          }
        />
      </section>

      {state.successMessage && !isEmailVerified && (
        <p className={styles.successMessage}>{state.successMessage}</p>
      )}
      {isEmailVerified && (
        <p className={styles.successMessage}>
          이메일이 성공적으로 인증되었습니다!
        </p>
      )}
    </div>
  );
}
