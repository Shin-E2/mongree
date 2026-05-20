"use client";

import AuthPageLayout from "@/components/layout/auth-page-layout";
import { CardStandardFullFull } from "@/commons/components/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

const fieldClassName =
  "flex flex-col gap-2 text-sm font-semibold text-[var(--mongree-text)]";
const inputClassName =
  "h-11 rounded-[var(--mongree-radius-sm)] border border-[color-mix(in_oklch,var(--mongree-line)_82%,transparent)] bg-[color-mix(in_oklch,var(--mongree-surface-raised)_92%,transparent)] px-4 text-sm text-[var(--mongree-text)] outline-none transition-shadow focus:border-[var(--mongree-primary)] focus:ring-2 focus:ring-[color-mix(in_oklch,var(--mongree-primary)_20%,transparent)]";

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
            <h1 className="text-2xl font-bold text-[var(--mongree-text)]">
              새 비밀번호 설정
            </h1>
            <p className="text-sm leading-6 text-[var(--mongree-text-muted)]">
              재설정 메일로 인증된 세션에서 새 비밀번호를 저장합니다.
            </p>
          </div>

          <label className={fieldClassName}>
            새 비밀번호
            <input
              className={inputClassName}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              type="password"
              value={password}
            />
          </label>

          <label className={fieldClassName}>
            새 비밀번호 확인
            <input
              className={inputClassName}
              minLength={8}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="새 비밀번호를 다시 입력하세요"
              type="password"
              value={passwordConfirm}
            />
          </label>

          {error && (
            <p className="text-sm font-medium text-[var(--mongree-danger)]">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm font-medium text-[var(--mongree-success)]">
              {message}
            </p>
          )}

          <button
            className="h-11 rounded-[var(--mongree-radius-sm)] bg-[var(--mongree-primary)] text-sm font-semibold text-[color-mix(in_oklch,var(--mongree-surface-raised)_96%,var(--mongree-text))] transition-colors hover:bg-[var(--mongree-primary-strong)] disabled:cursor-not-allowed disabled:opacity-55"
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
