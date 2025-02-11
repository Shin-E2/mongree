import HomeAIAnalysis from "@/components/home/(sidebar)/ai-analysis";
import HomeEmotionStats from "@/components/home/(sidebar)/emotion-stats";
import HomeEmotionalCalendar from "@/components/home/(sidebar)/emotional-calendar";
import HomePopularDiaryCard from "@/components/home/(sidebar)/popular-diary-card";
import HomeRecentDiary from "@/components/home/(sidebar)/recent-diary";
import { popularDiaries } from "@/mock/popular-diaries";

export default function HomePage() {
  return (
    <div className="p-8 px-6 bg-gray-50 h-full pb-24">
      <div className="grid grid-cols-12 gap-6">
        {/* 감정 캘린더 */}
        <div className="col-span-12 md:col-span-8">
          <HomeEmotionalCalendar />
        </div>

        {/* 이번달 감정 분포, ai감정분석 */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <HomeEmotionStats />
          <HomeAIAnalysis />
        </div>

        <div className="col-span-12 space-y-6">
          {/* 주간 인기 일기 TOP3 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">이번 주 인기 일기 TOP 3</h2>
            </div>
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
