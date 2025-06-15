import styles from "./loading.module.css";

export default function DiaryListLoading() {
  return (
    <div className={styles.mainContainer}>
      {/* 헤더 */}
      <div className={styles.headerSection}>
        <div className={styles.headerTitlePlaceholder} />
        <div className={styles.headerSubtitlePlaceholder} />
      </div>

      <div className={styles.contentSection}>
        {/* 필터 */}
        <div className={styles.filterSection}>
          <div className={styles.filterPlaceholder} />
          <div className={styles.filterButtonsWrapper}>
            <div className={styles.filterButtonPlaceholder} />
            <div className={styles.filterButtonPlaceholder} />
          </div>
        </div>

        {/* 카드 */}
        <div className={styles.cardsGrid}>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className={styles.cardContainer}>
              <div className={styles.cardHeader}>
                <div className={styles.cardBadgePlaceholder} />
                <div className={styles.cardBadgePlaceholder} />
              </div>
              <div className={styles.cardImagePlaceholder} />
              <div className={styles.cardTitlePlaceholder} />
              <div className={styles.cardContentPlaceholder1} />
              <div className={styles.cardContentPlaceholder2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
