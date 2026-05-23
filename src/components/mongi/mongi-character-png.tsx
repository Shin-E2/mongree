"use client";

import Image from "next/image";
import type { MongiState } from "./mongi-stage";
import styles from "./mongi-character-png.module.css";

const STATE_IMAGE: Record<MongiState, string> = {
  idle: "/characters/mongi/idle.png",
  greeting: "/characters/mongi/greeting.png",
  listening: "/characters/mongi/listening.png",
  react_happy: "/characters/mongi/happy.png",
  react_soft: "/characters/mongi/calm.png",
  reward: "/characters/mongi/reward.png",
  sleepy: "/characters/mongi/sleepy.png",
  celebrate: "/characters/mongi/excited.png",
  equip: "/characters/mongi/reward.png",
};

const STATE_CLASS: Record<MongiState, string> = {
  idle: styles.animIdle,
  greeting: styles.animGreeting,
  listening: styles.animListening,
  react_happy: styles.animHappy,
  react_soft: styles.animSoft,
  reward: styles.animReward,
  sleepy: styles.animSleepy,
  celebrate: styles.animCelebrate,
  equip: styles.animEquip,
};

interface MongiCharacterPngProps {
  state: MongiState;
  size: number;
  hovered?: boolean;
}

export function MongiCharacterPng({ state, size, hovered }: MongiCharacterPngProps) {
  const effectiveState = hovered && state === "idle" ? "greeting" : state;
  const src = STATE_IMAGE[effectiveState] ?? STATE_IMAGE.idle;
  const animClass = STATE_CLASS[effectiveState] ?? styles.animIdle;

  return (
    <div
      className={`${styles.wrap} ${animClass}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={styles.img}
        priority={state === "idle"}
        unoptimized
      />
    </div>
  );
}
