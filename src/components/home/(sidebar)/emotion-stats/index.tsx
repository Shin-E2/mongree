import type { HomeEmotionStat } from "@/app/(dashboard)/home/action";
import { HomeEmotionStatItem } from "../emotion-statItem";
import styles from "./styles.module.css";

interface HomeEmotionStatsProps {
  stats: HomeEmotionStat[];
}

export default function HomeEmotionStats({ stats }: HomeEmotionStatsProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>이번 달 감정 분포</h3>
      <div className={styles.listContainer}>
        {stats.length > 0 ? (
          stats.map((stat) => (
            <HomeEmotionStatItem
              key={stat.id}
              emotion={stat.image}
              label={stat.label}
              percentage={stat.percentage}
              count={stat.count}
              color="blue"
            />
          ))
        ) : (
          <p className={styles.emptyText}>이번 달 기록된 감정이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
