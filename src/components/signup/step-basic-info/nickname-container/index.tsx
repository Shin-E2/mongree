import { ButtonTextWithPaddingMM } from "@/commons/components/button-text";
import { InputStandardSFull } from "@/commons/components/input";
import styles from "./styles.module.css";
import { InputTitleStandardSFull } from "@/commons/components/input-title";
import useSignupStepBasicInfoNicknameContainer from "./hook";
import { useFormContext } from "react-hook-form";

export default function SignupStepBasicInfoNicknameContainer() {
  const {
    register,
    errors,
    successMessage,
    nicknameValue,
    handleCheckNickname,
    isSubmitting, // 요청 진행 상태
  } = useSignupStepBasicInfoNicknameContainer();

  return (
    <section className={styles.section}>
      <InputTitleStandardSFull title="닉네임" required />
      <div className={styles.section_nickname_duplication}>
        <InputStandardSFull
          placeholder="닉네임을 입력해주세요"
          name="nickname"
          register={register}
          errors={errors}
          successMessage={successMessage}
        />
        <ButtonTextWithPaddingMM
          title={isSubmitting ? "확인 중..." : "중복 확인"}
          type="button"
          onClick={handleCheckNickname}
          disabled={!nicknameValue || isSubmitting}
        />
      </div>
    </section>
  );
}
