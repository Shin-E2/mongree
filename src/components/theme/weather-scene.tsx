"use client";

import { useMongreeTheme } from "./theme-provider";
import styles from "./weather-scene.module.css";

export default function WeatherScene() {
  const { scene } = useMongreeTheme();

  return (
    <div className={styles.scene} aria-hidden="true" data-scene={scene}>
      <div className={styles.sun} />
      <div className={styles.moon} />
      <div className={styles.cloudOne} />
      <div className={styles.cloudTwo} />
      <div className={styles.stars} />
      <div className={styles.rain} />
      <div className={styles.snow} />
    </div>
  );
}
