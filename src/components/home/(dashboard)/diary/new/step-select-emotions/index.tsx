"use client";

import { EMOTIONS } from "@/mock/emotions";

interface IDiaryNewStepSelectEmotionsProps {
  selectedEmotions: string[];
  setSelectedEmotions: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DiaryNewStepSelectEmotions({
  selectedEmotions,
  setSelectedEmotions,
}: IDiaryNewStepSelectEmotionsProps) {
  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionId)
        ? prev.filter((id) => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">오늘의 감정</h2>
      <p className="text-gray-500 mb-6">현재 느끼는 감정을 모두 선택해주세요</p>

      <div className="grid grid-cols-3 gap-4">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => toggleEmotion(emotion.id)}
            className={`relative flex flex-col items-center p-4 rounded-xl
              transition-all duration-200 ease-in-out
              ${
                selectedEmotions.includes(emotion.id)
                  ? `${emotion.bgColor} ring-2 ${emotion.borderColor}`
                  : "hover:bg-gray-50"
              }`}
          >
            <img
              src={emotion.image}
              alt={emotion.label}
              className="w-16 h-16 mb-3"
            />
            <span className={`text-sm font-medium ${emotion.textColor}`}>
              {emotion.label}
            </span>

            {/* 감정
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
              px-3 py-1 bg-gray-900 text-white text-xs rounded-lg
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none whitespace-nowrap"
            >
              {emotion.description}
            </div> */}
          </button>
        ))}
      </div>
    </>
  );
}
