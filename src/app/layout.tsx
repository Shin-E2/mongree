import type { Metadata } from "next";
import { MongreeThemeProvider } from "@/components/theme/theme-provider";
import WeatherSceneClient from "@/components/theme/weather-scene-client";
import { PostHogProvider } from "@/components/providers/posthog-provider";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app";

export const metadata: Metadata = {
  title: "Mongree | 오늘의 감정을 기록하는 작은 일기장",
  description: "Mongree는 감정을 기록하고 돌아보는 따뜻한 감정 일기장입니다.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Mongree | 오늘의 감정을 기록하는 작은 일기장",
    description: "Mongree는 감정을 기록하고 돌아보는 따뜻한 감정 일기장입니다.",
    url: SITE_URL,
    siteName: "Mongree",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Mongree - 감정 일기장",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mongree | 오늘의 감정을 기록하는 작은 일기장",
    description: "Mongree는 감정을 기록하고 돌아보는 따뜻한 감정 일기장입니다.",
    images: ["/api/og"],
  },
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
        <PostHogProvider>
          <MongreeThemeProvider>
            <WeatherSceneClient />
            {children}
          </MongreeThemeProvider>
        </PostHogProvider>
        <div id="modal" /> {/* 모달 */}
      </body>
    </html>
  );
}
