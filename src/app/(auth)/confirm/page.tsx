"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SESSION_STORAGE_KEY,
  SignupTempFormData,
} from "@/commons/constants/signup";
import AuthPageLayout from "@/components/layout/auth-page-layout";
import { CardStandardFullFull } from "@/commons/components/card";
import styles from "./styles.module.css";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  useEffect(() => {
    const handleAuthCallback = async () => {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") as "email" | null;

      if (!tokenHash || !type) {
        console.error("Missing token_hash or type in URL");
        setVerificationStatus("error");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

      if (verifyError) {
        console.error("Supabase Verify OTP Error:", verifyError);
        setVerificationStatus("error");
      } else {
        console.log("Email verified successfully!");
        setVerificationStatus("success");

        const source = searchParams.get("source");
        if (source === "signup" && typeof window !== "undefined") {
          sessionStorage.setItem("mongree_email_verified", "true");
        }
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <AuthPageLayout>
      <CardStandardFullFull className={styles.cardContent}>
        {verificationStatus === "pending" && (
          <p className={styles.pendingText}>이메일 인증을 처리 중입니다...</p>
        )}
        {verificationStatus === "success" && (
          <>
            <p className={styles.successText}>
              이메일이 성공적으로 인증되었습니다!
            </p>
            <p className={styles.successDescription}>
              이 창을 닫고 원래 페이지로 돌아가 회원가입을 계속 진행해주세요.
            </p>
          </>
        )}
        {verificationStatus === "error" && (
          <>
            <p className={styles.errorText}>이메일 인증에 실패했습니다.</p>
            <p className={styles.errorDescription}>
              다시 시도하거나 고객 지원팀에 문의해주세요.
            </p>
          </>
        )}
      </CardStandardFullFull>
    </AuthPageLayout>
  );
}
