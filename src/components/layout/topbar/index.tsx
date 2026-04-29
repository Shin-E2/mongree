"use client";

import { CloudRain, Moon, Plus, Search, Snowflake, Sun } from "lucide-react";
import Link from "next/link";
import { SearchBarInput } from "@/commons/components/input";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import type { MongreeThemeScene } from "@/components/theme/theme.types";
import styles from "./styles.module.css";

const THEME_SEQUENCE: MongreeThemeScene[] = ["day", "night", "rain", "snow"];

const THEME_LABELS: Record<MongreeThemeScene, string> = {
  day: "낮 테마",
  night: "밤 테마",
  rain: "비 테마",
  snow: "눈 테마",
};

const THEME_ICONS = {
  day: Sun,
  night: Moon,
  rain: CloudRain,
  snow: Snowflake,
};

export default function TopBar() {
  const { scene, setScene } = useMongreeTheme();
  const ThemeIcon = THEME_ICONS[scene];

  const handleThemeToggle = () => {
    const currentIndex = THEME_SEQUENCE.indexOf(scene);
    const nextScene = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length];
    setScene(nextScene);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContentWrapper}>
        <div className={styles.searchAreaWrapper}>
          <div className={styles.searchBarContainer}>
            <SearchBarInput
              placeholder="일기 검색하기"
              iconLeft={<Search />}
            />
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <button
            className={styles.themeToggleButton}
            type="button"
            onClick={handleThemeToggle}
            aria-label={`${THEME_LABELS[scene]} 사용 중, 다음 테마로 변경`}
            title={`${THEME_LABELS[scene]} 사용 중`}
          >
            <ThemeIcon className={styles.iconBase} />
          </button>
          <Link href="/diary/new" className={styles.diaryWriteButton}>
            <Plus className={styles.plusIcon} />
            <span className={styles.diaryWriteButtonText}>일기 작성</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
