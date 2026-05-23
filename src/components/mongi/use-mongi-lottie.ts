"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { MongiState } from "./mongi-stage";

const LOTTIE_PATH = "/lottie/mongi.json";

// 스크립트에서 생성한 프레임 구간과 동기화
const STATE_SEGMENTS: Record<MongiState, [number, number]> = {
  idle:        [0,   90],
  greeting:    [90,  150],
  listening:   [150, 210],
  react_happy: [210, 270],
  react_soft:  [270, 330],
  reward:      [330, 390],
  sleepy:      [390, 450],
  celebrate:   [450, 540],
  equip:       [540, 590],
};

const LOOP_STATES: MongiState[] = ["idle", "listening", "sleepy"];

interface UseLottieMongiReturn {
  lottieAvailable: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  playState: (state: MongiState, onComplete?: () => void) => void;
}

export function useMongiLottie(): UseLottieMongiReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lottieAvailable, setLottieAvailable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animRef = useRef<any>(null);
  const completeHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!containerRef.current) return;

      try {
        const lottie = (await import("lottie-web")).default;
        const animData = await fetch(LOTTIE_PATH).then((r) => r.json());
        if (cancelled || !containerRef.current) return;

        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: false,
          animationData: animData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: true,
          },
        });

        anim.addEventListener("complete", () => {
          completeHandlerRef.current?.();
          completeHandlerRef.current = null;
        });

        anim.playSegments(STATE_SEGMENTS.idle, true);
        animRef.current = anim;
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

  const playState = useCallback((state: MongiState, onComplete?: () => void) => {
    const anim = animRef.current;
    if (!anim) return;

    const seg = STATE_SEGMENTS[state];
    const loop = LOOP_STATES.includes(state);

    completeHandlerRef.current = onComplete ?? null;
    anim.loop = loop;
    anim.playSegments(seg, true);
  }, []);

  return { lottieAvailable, containerRef, playState };
}
