"use client";

import { useMongreeTheme } from "./theme-provider";
import styles from "./weather-scene.module.css";

// 모듈 레벨에서 생성 — 리렌더 시에도 안정적
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: `${rand(4, 96)}%`,
  top: `${rand(2, 67)}%`,
  size: rand(1.2, 4.7),
  dur: `${rand(2, 4.5).toFixed(2)}s`,
  del: `${rand(0, 4).toFixed(2)}s`,
  op1: rand(0.5, 1).toFixed(2),
  op2: rand(0.05, 0.2).toFixed(2),
}));

const SHOOTS = [
  { id: 0, top: "8%",  left: "72%", width: "180px", dur: "1.3s", del: "7s",  sdx: "-520px", sdy: "380px" },
  { id: 1, top: "18%", left: "44%", width: "110px", dur: "1.0s", del: "17s", sdx: "-320px", sdy: "230px" },
];

const RAIN = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${rand(-5, 105)}%`,
  width: `${rand(2, 3.5).toFixed(1)}px`,
  height: `${rand(14, 34).toFixed(0)}px`,
  dur: `${rand(0.4, 0.95).toFixed(2)}s`,
  del: `${rand(0, 2).toFixed(2)}s`,
  opacity: rand(0.5, 0.95).toFixed(2),
}));

const SNOW = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${rand(-5, 105)}%`,
  size: `${rand(4, 11).toFixed(1)}px`,
  dur: `${rand(3.5, 7.5).toFixed(2)}s`,
  del: `${rand(0, 4).toFixed(2)}s`,
  opacity: rand(0.3, 0.95).toFixed(2),
}));

export default function WeatherScene() {
  const { scene } = useMongreeTheme();

  return (
    <div className={styles.scene} aria-hidden="true" data-scene={scene}>
      <div className={styles.sun} />
      <div className={styles.moon} />
      <div className={styles.cloudOne} />
      <div className={styles.cloudTwo} />

      {/* 별 + 별똥별 (밤) */}
      <div className={styles.starsWrap}>
        {STARS.map((s) => (
          <div
            key={s.id}
            className={styles.star}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              "--dur": s.dur,
              "--del": s.del,
              "--op1": s.op1,
              "--op2": s.op2,
            } as React.CSSProperties}
          />
        ))}
        {SHOOTS.map((s) => (
          <div
            key={s.id}
            className={styles.shootingStar}
            style={{
              top: s.top,
              left: s.left,
              width: s.width,
              "--sdur": s.dur,
              "--sdel": s.del,
              "--sdx": s.sdx,
              "--sdy": s.sdy,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 빗방울 */}
      <div className={styles.rainWrap}>
        {RAIN.map((r) => (
          <div
            key={r.id}
            className={styles.rainDrop}
            style={{
              left: r.left,
              width: r.width,
              height: r.height,
              opacity: Number(r.opacity),
              "--dur": r.dur,
              "--del": r.del,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 눈송이 */}
      <div className={styles.snowWrap}>
        {SNOW.map((f) => (
          <div
            key={f.id}
            className={styles.snowFlake}
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              opacity: Number(f.opacity),
              "--dur": f.dur,
              "--del": f.del,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
