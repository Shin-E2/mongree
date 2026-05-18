"use client";

import AuthPageLayout from "@/components/layout/auth-page-layout";
import { CardStandardFullFull } from "@/commons/components/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError("비밀번호를 변경하지 못했습니다. 재설정 메일을 다시 요청해주세요.");
        return;
      }

      setMessage("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
      window.setTimeout(() => router.push("/login"), 1200);
    });
  };

  return (
    <AuthPageLayout>
      <CardStandardFullFull>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-950">새 비밀번호 설정</h1>
            <p className="text-sm leading-6 text-gray-500">
              재설정 메일로 인증된 세션에서 새 비밀번호를 저장합니다.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            새 비밀번호
            <input
              className="h-11 rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              type="password"
              value={password}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            새 비밀번호 확인
            <input
              className="h-11 rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              minLength={8}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="새 비밀번호를 다시 입력하세요"
              type="password"
              value={passwordConfirm}
            />
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {message && (
            <p className="text-sm font-medium text-emerald-600">{message}</p>
          )}

          <button
            className="h-11 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-300"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "저장 중..." : "비밀번호 변경"}
          </button>
        </form>
      </CardStandardFullFull>
    </AuthPageLayout>
  );
}
