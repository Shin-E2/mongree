import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type MongreeTheme = "day" | "night" | "rain" | "snow";

const rainCodes = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]);
const snowCodes = new Set([71, 73, 75, 77, 85, 86]);

function themeFromWeather(weatherCode: number | null, hour: number): MongreeTheme {
  if (weatherCode !== null && snowCodes.has(weatherCode)) return "snow";
  if (weatherCode !== null && rainCodes.has(weatherCode)) return "rain";
  if (hour < 6 || hour >= 19) return "night";
  return "day";
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const weatherCodeParam = url.searchParams.get("weatherCode");
  const hourParam = url.searchParams.get("hour");
  const now = new Date();
  const weatherCode = weatherCodeParam === null ? null : Number(weatherCodeParam);
  const hour = hourParam === null ? now.getHours() : Number(hourParam);
  const safeWeatherCode = Number.isFinite(weatherCode) ? weatherCode : null;
  const safeHour = Number.isFinite(hour) ? Math.min(Math.max(hour, 0), 23) : now.getHours();
  const theme = themeFromWeather(safeWeatherCode, safeHour);

  return NextResponse.json({
    theme,
    hour: safeHour,
    weatherCode: safeWeatherCode,
    priority: theme === "rain" || theme === "snow" ? "weather" : "time",
  });
}

