"use client";

import dynamic from "next/dynamic";

const WeatherScene = dynamic(() => import("./weather-scene"), { ssr: false });

export default function WeatherSceneClient() {
  return <WeatherScene />;
}
