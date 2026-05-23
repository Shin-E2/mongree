"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MongiStage } from "@/components/mongi/mongi-stage";
import type { MongiState } from "@/components/mongi/mongi-stage";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import { URL } from "@/commons/constants/global-url";
import styles from "./styles.module.css";

export default function SceneCharacter() {
  const { scene } = useMongreeTheme();
  const [mongiState, setMongiState] = useState<MongiState>("idle");
  const isSleepy = scene === "night";

  useEffect(() => {
    const timer = setTimeout(() => {
      setMongiState(isSleepy ? "sleepy" : "greeting");
      const reset = setTimeout(() => setMongiState(isSleepy ? "sleepy" : "idle"), 2000);
      return () => clearTimeout(reset);
    }, 600);
    return () => clearTimeout(timer);
  }, [isSleepy]);

  return (
    <Link
      href={URL().MONGI}
      className={styles.wrapper}
      aria-label="몽이 꾸미기"
    >
      <MongiStage
        state={mongiState}
        onStateEnd={() => setMongiState(isSleepy ? "sleepy" : "idle")}
        size={80}
        className={styles.stage}
      />
    </Link>
  );
}
