import MongiFigure from "@/components/theme/mongi-figure";
import styles from "./loading.module.css";

export default function DiaryNewLoading() {
  return (
    <main className={styles.pageShell} aria-live="polite" aria-busy="true">
      <section className={styles.panel}>
        <MongiFigure className={styles.mongi} />
        <p className={styles.eyebrow}>오늘의 마음 날씨</p>
        <h1 className={styles.title}>일기장을 준비하고 있어요</h1>
        <p className={styles.description}>
          하늘이 잠깐 열리는 동안, 오늘 마음에 가까운 감정을 떠올려보세요.
        </p>
      </section>
    </main>
  );
}
