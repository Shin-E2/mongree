import { ButtonTextWithPaddingMM } from "@/commons/components/button-text";
import { InputFieldStandardSFull } from "@/commons/components/input-field";

export default function SignupStepBasicInfo() {
  return (
    <div className="space-y-6">
      {/* 이름, 닉네임 */}
      <div className="grid grid-cols-2 gap-8">
        {/* 이름 입력 필드 */}
        <InputFieldStandardSFull
          name="name"
          title="이름"
          placeholder="이름을 입력해주세요"
          required
        />

        {/* 닉네임 입력 영역 */}
        <div className="relative">
          <div className="flex items-end gap-2">
            <InputFieldStandardSFull
              name="nickname"
              title="닉네임"
              placeholder="닉네임을 입력해주세요"
              required
            />

            {/* 중복 확인 버튼 */}
            <ButtonTextWithPaddingMM type="button" title="중복확인" />
          </div>

          {/* 상태 메시지 */}
          {/* <div className="absolute -bottom-6">{renderStatusMessage()}</div> */}
        </div>
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
      <div className="space-y-4">
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
      </div>

      {/* 주소 입력 */}
      <InputFieldStandardSFull
        name="passwordConfirm"
        title="주소"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        required
        isAddress
      />
    </div>
  );
}
