"use client";

import { ButtonIconSocial } from "@/commons/components/button-icon";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase";
import styles from "./styles.module.css";

type SupportedProvider = "google" | "kakao";

async function handleSocialLogin(provider: SupportedProvider) {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      // OAuth 인증 완료 후 돌아올 콜백 URL
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
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
        {/* Naver: Supabase 미지원, 추후 구현 예정 */}
        <ButtonIconSocial
          provider="naver"
          disabled
          title="준비 중입니다"
        />
      </div>
    </section>
  );
}
