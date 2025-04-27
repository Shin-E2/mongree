"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { EMOTIONS } from "@/mock/emotions";
import Image from "next/image";

interface IDiaryListEmotionFilterProps {
  selectedEmotions: string[];
  onToggle: (id: string) => void;
}

export function DiaryListEmotionFilter({
  selectedEmotions,
  onToggle,
}: IDiaryListEmotionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 h-[46px]"
      >
        <span className="flex items-center">
          {selectedEmotions.length === 0 ? (
            <>
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm text-nowrap">감정 필터</span>
            </>
          ) : (
            <span className="text-sm text-indigo-600 font-medium">
              {selectedEmotions.length}개 선택됨
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-4 z-10">
          <div className="grid grid-cols-2 gap-2">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => {
                  onToggle(emotion.id);
                  setIsOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  selectedEmotions.includes(emotion.id)
                    ? `${emotion.bgColor} ${emotion.textColor}`
                    : "hover:bg-gray-50"
                }`}
              >
                <Image
                  src={emotion.image}
                  alt={emotion.label}
                  width={100}
                  height={100}
                  className="w-5 h-5 mr-2"
                />
                <span className="text-sm">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
