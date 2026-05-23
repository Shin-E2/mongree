"use client";

import { useEffect, useRef, useState } from "react";

const RIVE_ASSET_PATH = "/rive/mongi.riv";

export type MongiTriggerName = "greet" | "reactHappy" | "reactSoft" | "reward" | "celebrate" | "equipItem";

export type MongiRiveInput =
  | { type: "bool"; name: "isHovered" | "isWriting" | "isNight" | "isRain" | "isSnow"; value: boolean }
  | { type: "number"; name: "level" | "streakDays" | "emotionTone"; value: number }
  | { type: "trigger"; name: MongiTriggerName };

interface UseMongiRiveReturn {
  riveLoaded: boolean;
  riveAvailable: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setInput: (input: MongiRiveInput) => void;
  fireTrigger: (name: MongiTriggerName) => void;
}

async function checkRiveAssetExists(): Promise<boolean> {
  try {
    const res = await fetch(RIVE_ASSET_PATH, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

type RiveInput = { name: string; value?: boolean | number; fire?: () => void };

export function useMongiRive(): UseMongiRiveReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [riveLoaded, setRiveLoaded] = useState(false);
  const [riveAvailable, setRiveAvailable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const riveInstanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const exists = await checkRiveAssetExists();
      if (!exists || cancelled) return;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { Rive, Layout, Fit, Alignment } = await import("@rive-app/react-canvas") as any;
        if (!canvasRef.current || cancelled) return;

        riveInstanceRef.current = new Rive({
          src: RIVE_ASSET_PATH,
          canvas: canvasRef.current,
          stateMachines: "MongiMachine",
          layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
          autoplay: true,
          onLoad() {
            if (cancelled) return;
            setRiveLoaded(true);
            setRiveAvailable(true);
          },
          onLoadError() {
            setRiveAvailable(false);
          },
        });
      } catch {
        setRiveAvailable(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const setInput = (input: MongiRiveInput) => {
    if (!riveInstanceRef.current) return;
    const inputs: RiveInput[] | undefined = riveInstanceRef.current.stateMachineInputs?.("MongiMachine");
    if (!inputs) return;
    const target = inputs.find((i) => i.name === input.name);
    if (!target) return;
    if (input.type === "bool" || input.type === "number") {
      target.value = input.value;
    } else if (input.type === "trigger") {
      target.fire?.();
    }
  };

  const fireTrigger = (name: MongiTriggerName) => {
    setInput({ type: "trigger", name });
  };

  return { riveLoaded, riveAvailable, canvasRef, setInput, fireTrigger };
}
