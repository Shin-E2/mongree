"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import { AmbientAudioEngine } from "@/lib/ambient-audio";
import styles from "./styles.module.css";

const STORAGE_KEY = "mongree.bgm";

export default function BgmToggle() {
  const { scene } = useMongreeTheme();
  const engineRef = useRef<AmbientAudioEngine | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);

  // 저장된 볼륨 복원 (enabled는 브라우저 자동재생 정책상 자동 시작하지 않고 볼륨만 복원)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { volume?: number };
        if (typeof saved.volume === "number") {
          setVolume(Math.max(0, Math.min(1, saved.volume)));
        }
      }
    } catch {
      // localStorage 접근 불가 시 무시
    }
  }, []);

  // scene 변경 시 재생 중이면 크로스페이드 전환
  useEffect(() => {
    if (enabled && engineRef.current?.isStarted) {
      engineRef.current.setScene(scene);
    }
  }, [scene, enabled]);

  // 언마운트 시 정지
  useEffect(() => {
    const engine = engineRef.current;
    return () => {
      engine?.stop();
    };
  }, []);

  const persist = (next: { volume: number }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // 무시
    }
  };

  const getEngine = () => {
    if (!engineRef.current) {
      engineRef.current = new AmbientAudioEngine();
    }
    return engineRef.current;
  };

  const handleToggle = async () => {
    const engine = getEngine();
    if (!enabled) {
      engine.setVolume(volume);
      await engine.start(scene); // 사용자 제스처 → AudioContext.resume()
      setEnabled(true);
      setShowVolume(true);
    } else {
      engine.stop();
      setEnabled(false);
      setShowVolume(false);
    }
  };

  const handleVolume = (value: number) => {
    setVolume(value);
    engineRef.current?.setVolume(value);
    persist({ volume: value });
  };

  return (
    <div className={styles.wrap} onMouseLeave={() => setShowVolume(false)}>
      <button
        type="button"
        className={styles.button}
        onClick={handleToggle}
        onMouseEnter={() => enabled && setShowVolume(true)}
        aria-label={enabled ? "배경음 끄기" : "배경음 켜기"}
        aria-pressed={enabled}
        title={enabled ? "배경음 켜짐" : "배경음 꺼짐"}
      >
        {enabled ? (
          <Volume2 className={styles.icon} />
        ) : (
          <VolumeX className={styles.icon} />
        )}
      </button>

      {enabled && showVolume && (
        <div className={styles.volumePop}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => handleVolume(Number(event.target.value))}
            aria-label="배경음 볼륨"
            className={styles.slider}
          />
        </div>
      )}
    </div>
  );
}
