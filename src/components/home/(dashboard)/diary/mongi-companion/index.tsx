"use client";

import MongiFigure from "@/components/theme/mongi-figure";
import styles from "./styles.module.css";

interface MongiCompanionProps {
  onStartDiary: () => void;
}

export default function MongiCompanion({ onStartDiary }: MongiCompanionProps) {
  return (
    <section className={styles.wrapper} aria-labelledby="mongi-title">
      <div className={styles.characterWrap} aria-hidden="true">
        <MongiFigure className={styles.character} />
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>오늘의 마음 날씨</p>
        <h2 id="mongi-title" className={styles.title}>
          몽이가 조용히 기다리고 있어요
        </h2>
        <p className={styles.description}>
          짧게 남겨도 괜찮아요. 지금 마음 하나만 기록해보세요.
        </p>
        <button className={styles.action} type="button" onClick={onStartDiary}>
          오늘 마음 기록하기
        </button>
      </div>
    </section>
  );
}
