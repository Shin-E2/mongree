import type { Metadata } from "next";
import { MongreeThemeProvider } from "@/components/theme/theme-provider";
import WeatherSceneClient from "@/components/theme/weather-scene-client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mongree | 오늘의 감정을 기록하는 작은 일기장",
  description:
    "Mongree는 감정을 기록하고 돌아보는 따뜻한 감정 일기장입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MongreeThemeProvider>
          <WeatherSceneClient />
          {children}
        </MongreeThemeProvider>
        <div id="modal" /> {/* 모달 */}
      </body>
    </html>
  );
}
