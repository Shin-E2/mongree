import styles from "./styles.module.css";

export default function LoginFormTitle() {
  return (
    <section className={styles.section}>
      <h1 className={styles.section__h1}>몽그리</h1>
      <p className={styles.section__p}>로그인하여 시작하세요</p>
    </section>
  );
}
