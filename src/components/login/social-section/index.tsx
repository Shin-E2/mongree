"use client";

import { ButtonIconSocial } from "@/commons/components/button-icon";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase";
import styles from "./styles.module.css";

type SupportedProvider = "google" | "kakao";

function getOAuthRedirectUrl() {
  return `${window.location.origin}/api/auth/callback`;
}

async function handleSocialLogin(provider: SupportedProvider) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getOAuthRedirectUrl(),
    },
  });

  if (error) {
    console.error("소셜 로그인 시작 실패:", error.message);
  }
}

export default function LoginSocialSection() {
  return (
    <section className={styles.section}>
      <div className={styles.section__group}>
        <div className={styles.section__group__line}>
          <div className={styles.section__group__line__divider} />
        </div>
        <div className={styles.section__group__text}>
          <span className={styles.section__group__text__span}>간편 로그인</span>
        </div>
      </div>

      <div className={styles.section__buttons}>
        <ButtonIconSocial
          provider="google"
          onClick={() => handleSocialLogin("google")}
        />
        <ButtonIconSocial
          provider="kakao"
          onClick={() => handleSocialLogin("kakao")}
        />
      </div>
    </section>
  );
}
