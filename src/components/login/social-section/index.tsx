import { ButtonIconSocial } from "@/commons/components/button-icon";
import styles from "./styles.module.css";

export default function LoginSocialSection() {
  return (
    <section className={styles.section}>
      {/* 구분선과 텍스트 */}
      <div className={styles.section__group}>
        <div className={styles.section__group__line}>
          <div className={styles.section__group__line__divider} />
        </div>
        <div className={styles.section__group__text}>
          <span className={styles.section__group__text__span}>간편 로그인</span>
        </div>
      </div>

      {/* 소셜 로그인 버튼들 */}
      <div className={styles.section__buttons}>
        <ButtonIconSocial provider="google" />
        <ButtonIconSocial provider="kakao" />
        <ButtonIconSocial provider="naver" />
      </div>
    </section>
  );
}
