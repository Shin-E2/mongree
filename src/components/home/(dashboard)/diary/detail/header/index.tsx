import { ChevronLeft, CloudRain, Moon, Pencil, Share2, Snowflake, Sun, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMongreeTheme } from "@/components/theme/theme-provider";
import type { MongreeThemeScene } from "@/components/theme/theme.types";
import type { DiaryDetailHeaderProps } from "./types";
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

export default function DiaryDetailHeader({
  isOwner,
  diaryId,
  isPrivate,
  setShowDeleteModal,
}: DiaryDetailHeaderProps) {
  const router = useRouter();
  const { scene, setScene } = useMongreeTheme();
  const ThemeIcon = THEME_ICONS[scene];

  const handleThemeToggle = () => {
    const currentIndex = THEME_SEQUENCE.indexOf(scene);
    const nextScene = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length];
    setScene(nextScene);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <button
          onClick={() => router.back()}
          className={styles.backButton}
          type="button"
        >
          <ChevronLeft className={`${styles.iconBase} ${styles.backIcon}`} />
          <span className={styles.backButtonText}>돌아가기</span>
        </button>
        <div className={styles.actionButtons}>
          <button
            className={styles.themeButton}
            type="button"
            onClick={handleThemeToggle}
            aria-label={`${THEME_LABELS[scene]} 사용 중, 다음 테마로 변경`}
            title={`${THEME_LABELS[scene]} 사용 중`}
          >
            <ThemeIcon className={styles.iconBase} />
          </button>
          {!isPrivate && (
            <button className={styles.shareButton} title="공유하기" type="button">
              <Share2 className={styles.iconBase} />
            </button>
          )}
          {isOwner && (
            <>
              <Link
                href={`/diary/${diaryId}/edit`}
                className={styles.editButton}
                title="수정하기"
              >
                <Pencil className={styles.iconBase} />
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={styles.deleteButton}
                title="삭제하기"
                type="button"
              >
                <Trash2 className={styles.iconBase} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}