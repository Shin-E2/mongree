import Link from "next/link";
import MongiFigure from "@/components/theme/mongi-figure";
import MongiInventoryClient from "../profile/mongi-inventory-client";
import styles from "./styles.module.css";

export default function MongiPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <span className={styles.badge}>몽이 꾸미기</span>
          <h1 className={styles.heroTitle}>오늘의 몽이를 골라주세요</h1>
          <p className={styles.heroDescription}>
            일기를 쓰며 모은 아이템으로 몽이의 분위기를 바꿉니다. 아직은 기본
            아이템부터 시작하고, 이후 보상과 이벤트로 확장합니다.
          </p>
          <Link href="/home" className={styles.secondaryLink}>
            홈으로 돌아가기
          </Link>
        </div>
        <div className={styles.figureStage} aria-hidden="true">
          <MongiFigure className={styles.figure} />
        </div>
      </section>

      <MongiInventoryClient />
    </div>
  );
}
