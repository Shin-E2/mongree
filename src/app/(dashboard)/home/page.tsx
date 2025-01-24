"use client";

import HomeAIAnalysis from "@/components/home/ai-analysis";
import HomeEmotionStats from "@/components/home/emotion-stats";
import HomeEmotionalCalendar from "@/components/home/emotional-calendar";
import HomePopularDiaryCard from "@/components/home/popular-diary-card";
import HomeRecentDiary from "@/components/home/recent-diary";
import { popularDiaries } from "@/mock/popular-diaries";

export default function HomePage() {
  return (
    <div className="pt-16 p-8 bg-gray-50 h-full">
      <div className="grid grid-cols-12 gap-6">
        <HomeEmotionalCalendar />
        <div className="col-span-4 space-y-6">
          <HomeEmotionStats />
          <HomeAIAnalysis />
        </div>
        <div className="col-span-12 space-y-6">
          {/* 주간 인기 일기 TOP3 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">이번 주 인기 일기 TOP 3</h2>
            </div>
            {/* 인기 일기 카드 컴포넌트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularDiaries.map((diary) => (
                <HomePopularDiaryCard key={diary.id} diary={diary} />
              ))}
            </div>
          </div>
          <HomeRecentDiary />
        </div>
      </div>
    </div>
  );
}
