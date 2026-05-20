"use client";

import type { CSSProperties } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getEmotionColor,
  getEmotionSoftColor,
  getEmotionTextColor,
} from "@/commons/constants/emotions";
import type {
  StatisticsEmotion,
  StatisticsTrendPoint,
  StatisticsWeekdayPoint,
} from "./action";
import styles from "./styles.module.css";

const CHART_AXIS_COLOR = "oklch(0.58 0.035 245)";
const CHART_GRID_COLOR = "oklch(0.88 0.025 245)";
const CHART_ACCENT_COLOR = "oklch(0.72 0.07 205)";
const CHART_ACCENT_SOFT = "oklch(0.92 0.035 205)";

const tooltipStyle = {
  border: "1px solid oklch(0.86 0.025 245)",
  borderRadius: 16,
  background: "oklch(0.985 0.01 245)",
  boxShadow:
    "0 18px 42px color-mix(in oklch, oklch(0.24 0.035 245) 12%, transparent)",
  color: "oklch(0.28 0.035 245)",
};

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
  const dominantEmotion = emotions[0];
  const totalEmotionCount = emotions.reduce(
    (sum, emotion) => sum + emotion.count,
    0
  );

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
            <AreaChart
              data={trend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_ACCENT_COLOR}
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_ACCENT_SOFT}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: CHART_ACCENT_SOFT }}
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  value ?? "기록 없음",
                  name === "moodScore" ? "감정 온도" : "일기 수",
                ]}
              />
              <Area
                type="monotone"
                dataKey="moodScore"
                stroke={CHART_ACCENT_COLOR}
                strokeWidth={3}
                fill="url(#moodGradient)"
                connectNulls
                activeDot={{ r: 5, fill: CHART_ACCENT_COLOR }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.distributionPanel}`}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>감정 분포</h2>
            <p className={styles.panelDescription}>
              이번 달 마음이 어느 방향으로 자주 움직였는지 보여줍니다.
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
                  outerRadius="84%"
                  paddingAngle={4}
                >
                  {emotions.map((emotion, index) => (
                    <Cell
                      key={emotion.id}
                      fill={getEmotionColor(emotion.id, index)}
                      stroke={getEmotionSoftColor(emotion.id, index)}
                      strokeWidth={2}
                    />
                  ))}
                  <Label
                    position="center"
                    content={() => (
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x="50%"
                          dy="-0.3em"
                          className={styles.pieCenterValue}
                        >
                          {totalEmotionCount}
                        </tspan>
                        <tspan
                          x="50%"
                          dy="1.5em"
                          className={styles.pieCenterLabel}
                        >
                          감정 기록
                        </tspan>
                      </text>
                    )}
                  />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.emotionLegend}>
            {dominantEmotion && (
              <div
                className={styles.dominantEmotionCard}
                style={{
                  "--emotion-color": getEmotionColor(dominantEmotion.id),
                  "--emotion-soft-color": getEmotionSoftColor(dominantEmotion.id),
                  "--emotion-text-color": getEmotionTextColor(dominantEmotion.id),
                } as CSSProperties}
              >
                <span className={styles.dominantLabel}>대표 감정</span>
                <strong className={styles.dominantValue}>
                  {dominantEmotion.label}
                </strong>
                <span className={styles.dominantDescription}>
                  전체 감정 기록 중 {dominantEmotion.percentage}%
                </span>
              </div>
            )}
            {emotions.length > 0 ? (
              emotions.map((emotion, index) => (
                <div key={emotion.id} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{
                      backgroundColor: getEmotionColor(emotion.id, index),
                    }}
                  />
                  <span className={styles.legendLabel}>{emotion.label}</span>
                  <span className={styles.legendTrack}>
                    <span
                      className={styles.legendBar}
                      style={{
                        width: `${emotion.percentage}%`,
                        backgroundColor: getEmotionColor(emotion.id, index),
                      }}
                    />
                  </span>
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
            <BarChart
              data={weekdayPattern}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke={CHART_GRID_COLOR} vertical={false} />
              <XAxis
                dataKey="weekday"
                tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              {topEmotions.map((emotion, index) => (
                <Bar
                  key={emotion.id}
                  dataKey={emotion.id}
                  name={emotion.label}
                  stackId="emotion"
                  fill={getEmotionColor(emotion.id, index)}
                  radius={
                    index === topEmotions.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
