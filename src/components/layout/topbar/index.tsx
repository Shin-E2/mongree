import { Search, Sun, Plus } from "lucide-react";
import Link from "next/link";
import { SearchBarInput } from "@/commons/components/input";
import styles from "./styles.module.css";

export default function TopBar() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContentWrapper}>
        <div className={styles.searchAreaWrapper}>
          <div className={styles.searchBarContainer}>
            <SearchBarInput
              placeholder="일기 검색하기..."
              iconLeft={<Search />}
            />
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <button className={styles.themeToggleButton}>
            <Sun className={styles.iconBase} />
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
