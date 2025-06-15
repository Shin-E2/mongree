"use client";

import { ButtonTextStandardSFull } from "@/commons/components/button-text";
import { FormStandardFullFull } from "@/commons/components/form";
import { InputFieldStandardSFull } from "@/commons/components/input-field";
import useLoginFormSection from "./hook";
import { LoginFormSchema, type LoginFormType } from "./form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormContext } from "react-hook-form";

export default function LoginFormSection() {
  // const onSubmit = useLoginFormSection(); => 여기서 계속 context null 에러 발생
  return (
    <FormStandardFullFull<LoginFormType>
      resolver={zodResolver(LoginFormSchema)}
      onSubmit={() => {}} // 실질적 onSubmit은 children에서 handleSubmit로 처리
    >
      <LoginFormFields />
    </FormStandardFullFull>
  );
}

function LoginFormFields() {
  const { handleSubmit, setError } = useFormContext<LoginFormType>();
  const { onSubmit } = useLoginFormSection();

  return (
    <>
      {/* 이메일 입력 필드 */}
      <InputFieldStandardSFull
        name="email"
        title="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        required
      />

      {/* 비밀번호 입력 필드 */}
      <InputFieldStandardSFull
        name="password"
        title="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        required
      />

      {/* 아이디/비밀번호 찾기 기능은 추후 구현 예정 */}
      {/* <div className="flex justify-end">
  <Button variant="link" className="text-sm text-gray-600">
    아이디/비밀번호 찾기
  </Button>
</div> */}

      {/* 로그인 버튼 */}
      <ButtonTextStandardSFull
        title="로그인"
        type="submit"
        onClick={handleSubmit((data) => onSubmit(data, setError))}
      />
    </>
  );
}
