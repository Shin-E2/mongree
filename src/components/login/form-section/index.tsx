"use client";

import { ButtonTextStandardSFull } from "@/commons/components/button-text";
import { FormStandardFullFull } from "@/commons/components/form";
import { InputFieldStandardSFull } from "@/commons/components/input-field";
import useLoginFormSection from "./hook";
import { LoginFormSchema, type LoginFormType } from "./form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";

export default function LoginFormSection() {
  return (
    <FormStandardFullFull<LoginFormType>
      resolver={zodResolver(LoginFormSchema)}
      onSubmit={() => {}}
    >
      <LoginFormFields />
    </FormStandardFullFull>
  );
}

function LoginFormFields() {
  const { getValues, handleSubmit, setError } = useFormContext<LoginFormType>();
  const { onSubmit, onRequestPasswordReset } = useLoginFormSection();
  const [resetMessage, setResetMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePasswordReset = () => {
    setResetMessage("");
    startTransition(async () => {
      const result = await onRequestPasswordReset(getValues("email"), setError);
      if (result?.successMessage) {
        setResetMessage(result.successMessage);
      }
    });
  };

  return (
    <>
      <InputFieldStandardSFull
        name="email"
        title="이메일"
        type="email"
        placeholder="이메일을 입력하세요"
        required
      />

      <InputFieldStandardSFull
        name="password"
        title="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        required
      />

      <div className="flex justify-end">
        <button
          className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 disabled:text-gray-300"
          disabled={isPending}
          type="button"
          onClick={handlePasswordReset}
        >
          {isPending ? "메일 발송 중..." : "비밀번호 찾기"}
        </button>
      </div>

      {resetMessage && (
        <p className="text-sm font-medium text-emerald-600">{resetMessage}</p>
      )}

      <ButtonTextStandardSFull
        title="로그인"
        type="submit"
        onClick={handleSubmit((data) => onSubmit(data, setError))}
      />
    </>
  );
}
