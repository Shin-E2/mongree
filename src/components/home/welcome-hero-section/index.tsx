import Link from "next/link";
import styles from "./styles.module.css";
import { ButtonTextStandardSFull } from "@/commons/components/button-text";

export default function WelcomeHeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            몽그리와 함께
            <br />
            당신의 마음을 보듬어보세요
          </h1>
          <p className={styles.description}>
            일상의 감정을 기록하고, 전문 상담사와 함께 이야기를 나눠보세요
          </p>
          <div className={styles.buttonWrapper}>
            <ButtonTextStandardSFull href={`/login`} title="시작하기" />
          </div>
        </div>
      </div>
    </section>
  );
}
