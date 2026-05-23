"use client";

import { useEffect, useRef, useState } from "react";

const LOTTIE_ASSET_PATH = "/lottie/mongi.json";

export type MongiLottieState =
  | "idle"
  | "greeting"
  | "listening"
  | "react_happy"
  | "react_soft"
  | "reward"
  | "sleepy"
  | "celebrate"
  | "equip";

interface UseLottieMongiReturn {
  lottieAvailable: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  playState: (state: MongiLottieState) => void;
  setSpeed: (speed: number) => void;
}

// Lottie JSON is 90 frames total (0-89), 30fps = 3s loop
// States share the same animation but play at different speeds to suggest different moods
const STATE_SPEED: Partial<Record<MongiLottieState, number>> = {
  idle: 1,
  greeting: 2.2,
  react_happy: 2.8,
  react_soft: 0.6,
  reward: 3,
  sleepy: 0.4,
  celebrate: 3.5,
  equip: 2,
  listening: 0.7,
};

export function useMongiLottie(): UseLottieMongiReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lottieAvailable, setLottieAvailable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!containerRef.current) return;

      try {
        const lottie = (await import("lottie-web")).default;
        const animData = await fetch(LOTTIE_ASSET_PATH).then((r) => r.json());
        if (cancelled || !containerRef.current) return;

        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: animData,
        });
        setLottieAvailable(true);
      } catch {
        setLottieAvailable(false);
      }
    }

    init();
    return () => {
      cancelled = true;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, []);

  const setSpeed = (speed: number) => {
    if (!animRef.current) return;
    animRef.current.setSpeed(speed);
  };

  const playState = (state: MongiLottieState) => {
    if (!animRef.current) return;
    const speed = STATE_SPEED[state] ?? 1;
    animRef.current.setSpeed(speed);
    animRef.current.goToAndPlay(0, true);
  };

  return { lottieAvailable, containerRef, playState, setSpeed };
}
