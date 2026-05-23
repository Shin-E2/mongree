"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import { URL } from "@/commons/constants/global-url";
import styles from "./styles.module.css";
import charStyles from "./scene-character.module.css";

type WeatherScene = "day" | "night" | "rain" | "snow";

const SCENE_IMAGE: Record<WeatherScene, string> = {
  day: "/characters/mongi/day.png",
  night: "/characters/mongi/night.png",
  rain: "/characters/mongi/rain.png",
  snow: "/characters/mongi/snow.png",
};

function isWeatherScene(scene: string): scene is WeatherScene {
  return scene === "day" || scene === "night" || scene === "rain" || scene === "snow";
}

export default function SceneCharacter() {
  const { scene } = useMongreeTheme();
  const [greeting, setGreeting] = useState(false);

  const weatherScene: WeatherScene = isWeatherScene(scene) ? scene : "day";
  const src = SCENE_IMAGE[weatherScene];

  useEffect(() => {
    const t = setTimeout(() => {
      setGreeting(true);
      const r = setTimeout(() => setGreeting(false), 1800);
      return () => clearTimeout(r);
    }, 700);
    return () => clearTimeout(t);
  }, [scene]);

  return (
    <Link
      href={URL().MONGI}
      className={styles.wrapper}
      aria-label="몽이 꾸미기"
    >
      <div
        className={`${charStyles.character} ${greeting ? charStyles.greeting : charStyles.idle}`}
        style={{ width: 80, height: 80 }}
      >
        <Image
          src={src}
          alt="몽이"
          width={80}
          height={80}
          className={charStyles.img}
          priority
          unoptimized
        />
      </div>
    </Link>
  );
}
