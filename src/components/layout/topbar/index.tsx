"use client";

import { CloudRain, Moon, Plus, Search, Snowflake, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { URL } from "@/commons/constants/global-url";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import type { MongreeThemeScene } from "@/components/theme/theme.types";
import TopbarUserAvatar from "./user-avatar";
import styles from "./styles.module.css";
import { usePageTitle } from "./use-page-title";

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
  const [spinning, setSpinning] = useState(false);
  const pageTitle = usePageTitle();
  const ThemeIcon = THEME_ICONS[scene];

  const handleThemeToggle = () => {
    if (spinning) return;
    setSpinning(true);
    const currentIndex = THEME_SEQUENCE.indexOf(scene);
    const nextScene = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length];
    setScene(nextScene);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContentWrapper}>
        <div className={styles.pageContext}>
          <span className={styles.pageEyebrow}>Mongree</span>
          <strong className={styles.pageTitle}>{pageTitle}</strong>
        </div>

        <div className={styles.buttonsWrapper}>
          <button
            className={styles.searchButton}
            type="button"
            aria-label="일기 검색 열기"
            title="일기 검색"
          >
            <Search className={styles.iconBase} />
          </button>
          <button
            className={styles.themeToggleButton}
            type="button"
            onClick={handleThemeToggle}
            aria-label={`${THEME_LABELS[scene]} 사용 중, 다음 테마로 변경`}
            title={`${THEME_LABELS[scene]} 사용 중`}
          >
            <ThemeIcon
              className={`${styles.iconBase} ${spinning ? styles.iconSpin : ""}`}
              onAnimationEnd={() => setSpinning(false)}
            />
          </button>
          <Link href={URL().DIARY_NEW} className={styles.diaryWriteButton}>
            <Plus className={styles.plusIcon} />
            <span className={styles.diaryWriteButtonText}>일기 작성</span>
          </Link>
          <TopbarUserAvatar />
        </div>
      </div>
    </header>
  );
}
