import { ButtonTextWithPaddingMM } from "@/commons/components/button-text";
import { InputStandardSFull } from "@/commons/components/input";
import styles from "./styles.module.css";
import { InputTitleStandardSFull } from "@/commons/components/input-title";
import useSignupStepBasicInfoNicknameContainer from "./hook";
import { useEffect } from "react";
import { SignupStepBasicInfoNicknameContainerProps } from "./types";

export default function SignupStepBasicInfoNicknameContainer({
  onCheckSuccess,
  initialFormData,
  saveTempFormData,
}: SignupStepBasicInfoNicknameContainerProps) {
  const {
    register,
    errors,
    successMessage,
    nicknameValue,
    handleCheckNickname,
    isSubmitting, // 요청 진행 상태
    handleNicknameChange,
  } = useSignupStepBasicInfoNicknameContainer({
    initialFormData,
    saveTempFormData,
  });

  // 닉네임 중복확인 성공 시 부모에 true 전달
  useEffect(() => {
    if (onCheckSuccess) {
      onCheckSuccess(successMessage === "사용 가능한 닉네임입니다.");
    }
  }, [successMessage, onCheckSuccess]);

  // 중복 확인 버튼 클릭 시 saveTempFormData 먼저 호출 (useSignupStepBasicInfoNicknameContainer 훅 내에서 처리되므로 여기서는 직접 호출하지 않음)
  const handleClickCheckNickname = async () => {
    await handleCheckNickname(); // 닉네임 중복 확인 진행
  };

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
          onChange={handleNicknameChange}
        />
        <ButtonTextWithPaddingMM
          title={isSubmitting ? "확인 중..." : "중복 확인"}
          type="button"
          onClick={handleClickCheckNickname}
          disabled={!nicknameValue || isSubmitting}
        />
      </div>
    </section>
  );
}
