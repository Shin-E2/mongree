"use client";

import { useMongreeTheme } from "./theme-provider";
import styles from "./scene-effects.module.css";

export default function SceneEffects() {
  const { scene } = useMongreeTheme();

  return (
    <div className={styles.effects} data-scene={scene} aria-hidden="true">
      <span className={styles.cloudOne} />
      <span className={styles.cloudTwo} />
      <span className={styles.starOne} />
      <span className={styles.starTwo} />
      <span className={styles.shootingStar} />
      <span className={styles.dropOne} />
      <span className={styles.dropTwo} />
      <span className={styles.dropThree} />
      <span className={styles.snowOne} />
      <span className={styles.snowTwo} />
      <span className={styles.snowThree} />
    </div>
  );
}
