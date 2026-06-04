"use client";

import dynamic from "next/dynamic";
import styles from "./mongi-3d.module.css";

// three/R3F 번들은 /mongi 에서만 클라이언트 로드 (다른 페이지 번들 보호)
const Mongi3DScene = dynamic(() => import("./mongi-3d-scene"), {
  ssr: false,
  loading: () => (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.loadingDot} />
      <span className={styles.loadingText}>몽이를 부르는 중...</span>
    </div>
  ),
});

export default function Mongi3D() {
  return <Mongi3DScene />;
}
