"use client";

import Image from "next/image";
import Link from "next/link";
import { URL } from "@/commons/constants/global-url";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import type { MongreeThemeScene } from "@/components/theme/theme.types";
import styles from "./styles.module.css";

const CHARACTER_IMAGES: Record<MongreeThemeScene, string> = {
  day: "/characters/day.svg",
  night: "/characters/night.svg",
  rain: "/characters/rain.svg",
  snow: "/characters/snow.svg",
};

const CHARACTER_ALTS: Record<MongreeThemeScene, string> = {
  day: "맑은 날 Mongree 캐릭터",
  night: "밤 하늘 Mongree 캐릭터",
  rain: "비 오는 날 Mongree 캐릭터",
  snow: "눈 오는 날 Mongree 캐릭터",
};

export default function SceneCharacter() {
  const { scene } = useMongreeTheme();

  return (
    <Link
      href={URL().PROFILE}
      className={styles.wrapper}
      aria-label="내 프로필 보기"
    >
      <Image
        src={CHARACTER_IMAGES[scene]}
        alt={CHARACTER_ALTS[scene]}
        width={80}
        height={80}
        className={styles.image}
        priority={false}
        unoptimized
      />
    </Link>
  );
}
