import { InputFieldStandardSFull } from "@/commons/components/input-field";
import styles from "./styles.module.css";
import SignupStepBasicInfoNicknameContainer from "./nickname-container";

export default function SignupStepBasicInfo() {
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
        <SignupStepBasicInfoNicknameContainer />
      </div>

      {/* 이메일 */}
      <InputFieldStandardSFull
        name="email"
        title="이메일"
        type="email"
        placeholder="이메일을 입력해주세요"
        required
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
      <InputFieldStandardSFull
        name="address"
        title="주소"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        isAddress
      />
    </section>
  );
}
