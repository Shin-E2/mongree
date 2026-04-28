"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  StatisticsEmotion,
  StatisticsTrendPoint,
  StatisticsWeekdayPoint,
} from "./action";
import styles from "./styles.module.css";

const EMOTION_COLORS: Record<string, string> = {
  happy: "#fbbf24",
  joyful: "#fb7185",
  grinning: "#facc15",
  calm: "#60a5fa",
  excited: "#a78bfa",
  anxious: "#38bdf8",
  scared: "#818cf8",
  sad: "#94a3b8",
  disappointed: "#f97316",
  angry: "#ef4444",
  confused: "#34d399",
};

const FALLBACK_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];

function getEmotionColor(emotionId: string, index: number) {
  return EMOTION_COLORS[emotionId] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

interface StatisticsChartsProps {
  emotions: StatisticsEmotion[];
  trend: StatisticsTrendPoint[];
  weekdayPattern: StatisticsWeekdayPoint[];
}

export default function StatisticsCharts({
  emotions,
  trend,
  weekdayPattern,
}: StatisticsChartsProps) {
  const topEmotions = emotions.slice(0, 5);

  return (
    <>
      <section className={`${styles.panel} ${styles.trendPanel}`}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>최근 감정 온도</h2>
            <p className={styles.panelDescription}>
              날짜별 감정 기록을 0~100 사이의 흐름으로 바꿔 보여줍니다.
            </p>
          </div>
        </div>
        <div className={styles.chartBox}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#eef2ff" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: "#c7d2fe" }}
                contentStyle={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.12)",
                }}
                formatter={(value, name) => [
                  value ?? "기록 없음",
                  name === "moodScore" ? "감정 온도" : "일기 수",
                ]}
              />
              <Area
                type="monotone"
                dataKey="moodScore"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="url(#moodGradient)"
                connectNulls
                activeDot={{ r: 5, fill: "#4f46e5" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>감정 분포</h2>
            <p className={styles.panelDescription}>
              이번 달에 가장 많이 나온 감정을 비율로 확인합니다.
            </p>
          </div>
        </div>
        <div className={styles.distributionLayout}>
          <div className={styles.pieBox}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotions}
                  dataKey="count"
                  nameKey="label"
                  innerRadius="62%"
                  outerRadius="86%"
                  paddingAngle={3}
                >
                  {emotions.map((emotion, index) => (
                    <Cell
                      key={emotion.id}
                      fill={getEmotionColor(emotion.id, index)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.12)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.emotionLegend}>
            {emotions.length > 0 ? (
              emotions.map((emotion, index) => (
                <div key={emotion.id} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ backgroundColor: getEmotionColor(emotion.id, index) }}
                  />
                  <span className={styles.legendLabel}>{emotion.label}</span>
                  <span className={styles.legendValue}>
                    {emotion.percentage}%
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>감정 기록이 쌓이면 분포가 표시됩니다.</p>
            )}
          </div>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.weekdayPanel}`}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>요일별 감정 패턴</h2>
            <p className={styles.panelDescription}>
              어떤 요일에 어떤 감정이 자주 나타나는지 비교합니다.
            </p>
          </div>
        </div>
        <div className={styles.chartBox}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayPattern} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#eef2ff" vertical={false} />
              <XAxis
                dataKey="weekday"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 16px 36px rgba(15, 23, 42, 0.12)",
                }}
              />
              {topEmotions.map((emotion, index) => (
                <Bar
                  key={emotion.id}
                  dataKey={emotion.id}
                  name={emotion.label}
                  stackId="emotion"
                  fill={getEmotionColor(emotion.id, index)}
                  radius={index === topEmotions.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
