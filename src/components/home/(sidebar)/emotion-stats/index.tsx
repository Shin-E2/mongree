import { HomeEmotionStatItem } from "../emotion-statItem";

export default function HomeEmotionStats() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">이번 달 감정 분포</h3>
      <div className="flex flex-col gap-4">
        <HomeEmotionStatItem
          emotion="/image/emotions/sad.svg"
          percentage={25}
          color="blue"
        />
        <HomeEmotionStatItem
          emotion="/image/emotions/angry.svg"
          percentage={15}
          color="blue"
        />
        <HomeEmotionStatItem
          emotion="/image/emotions/joyful.svg"
          percentage={60}
          color="blue"
        />
        {/* 기타 등등의 감정 */}
      </div>
    </div>
  );
}
