import Link from "next/link";
import styles from "./styles.module.css";

export default function LoginSignupSection() {
  return (
    <section className={styles.section}>
      <span className={styles.section__span}>계정이 없으신가요?</span>
      <Link href="/signup" className={styles.section__link}>
        회원가입
      </Link>
    </section>
  );
}
