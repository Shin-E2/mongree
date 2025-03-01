"use client";

import type { Diary } from "@/app/(dashboard)/diary/types";
import { formatToTimeAgo } from "@/lib/utils";
import { EMOTIONS, type Emotion } from "@/mock/emotions";
import { Tag } from "lucide-react";
import Image from "next/image";

interface EmotionWithStyle extends Emotion {
  id: string;
  label: string;
}

interface IDiaryListDiaryCardProps {
  diary: Diary;
  onClick: () => void;
}

export function DiaryListDiaryCard({
  diary,
  onClick,
}: IDiaryListDiaryCardProps) {
  const emotions = diary.diaryEmotion.map(({ emotion }) => {
    const emotionConfig = EMOTIONS.find((e) => e.id === emotion.id);
    return {
      ...emotion,
      ...emotionConfig,
    } as EmotionWithStyle;
  });

  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer group h-full flex flex-col overflow-hidden"
    >
      {/* 이미지 영역 */}
      {diary.images.length > 0 && (
        <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
          <img
            src={diary.images[0].url}
            alt="일기 이미지"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {diary.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              +{diary.images.length - 1}
            </div>
          )}
        </div>
      )}

      {/* 감정 뱃지 */}
      <div className="px-4 py-3 border-b h-[57px]">
        {emotions.length > 3 ? (
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {emotions.slice(0, 3).map((emotion) => (
                <div
                  key={emotion.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white ${emotion.bgColor}`}
                >
                  <img
                    src={emotion.image}
                    alt={emotion.label}
                    className="w-5 h-5"
                  />
                </div>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              외 {emotions.length - 3}개
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 h-full items-center">
            {emotions.map((emotion) => (
              <span
                key={emotion.id}
                className={`flex items-center px-2.5 py-1 rounded-full text-xs ${emotion.bgColor} ${emotion.textColor}`}
              >
                <Image
                  src={emotion.image}
                  alt={emotion.label}
                  width={100}
                  height={100}
                  className="w-4 h-4 mr-1"
                />
                {emotion.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-base line-clamp-1 group-hover:text-indigo-600">
            {diary.title}
          </h3>
          <time className="text-xs text-gray-500 flex-shrink-0">
            {formatToTimeAgo(diary.createdAt.toISOString())}
          </time>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {diary.content}
        </p>

        {diary.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
            {diary.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs text-gray-500 flex items-center rounded-full bg-gray-100"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t mt-auto">
          <div className="flex items-center text-xs text-gray-500">
            <span
              className={`w-2 h-2 mr-1.5 rounded-full ${
                diary.isPrivate ? "bg-red-500" : "bg-green-500"
              }`}
            />
            {diary.isPrivate ? "비공개" : "공개"}
          </div>
        </div>
      </div>
    </div>
  );
}
