"use client";

import { useMongreeTheme } from "./theme-provider";
import styles from "./scene-character.module.css";

export default function SceneCharacter() {
  const { scene } = useMongreeTheme();

  return (
    <div
      className={styles.character}
      aria-hidden="true"
      data-scene={scene}
    >
      <div className={styles.head}>
        <div className={styles.eyeLeft} />
        <div className={styles.eyeRight} />
        <div className={styles.cheekLeft} />
        <div className={styles.cheekRight} />
        <div className={styles.mouth} />
      </div>
      <div className={styles.accessory} />
    </div>
  );
}
