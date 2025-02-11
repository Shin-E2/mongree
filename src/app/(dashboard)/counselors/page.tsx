"use client";

import React from "react";

import { HeaderStandardMFull } from "@/commons/components/header";
import { MapPin, Search } from "lucide-react";

export default function CounselorListPage() {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <HeaderStandardMFull
        title="상담사 찾기"
        description="신뢰할 수 있는 전문 상담사를 만나보세요"
      />
      {/* search and Filter */}
      <div className="px-8 py-6">
        <div className="flex flex-wrap gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="상담사 이름 또는 키워드로 검색"
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Location Filter */}
          <div className="w-48">
            <div className="relative">
              <select className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-indigo-500 appearance-none">
                <option value="">지역 선택</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
                <option value="인천">인천</option>
              </select>
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      {/* 상담사 리스트 */}
      <div className="px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              key={index}
            >
              <div className="relative">
                <img
                  src="/image/emotions/happy.svg"
                  alt="상담사 프로필"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    상담 가능
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">김상담 상담사</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm font-medium">4.8</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  10년 경력의 전문 상담사입니다. 우울증, 불안장애, 대인관계 등
                  전문적인 상담을 제공합니다.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                    #우울증
                  </span>
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                    #불안장애
                  </span>
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                    #대인관계
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">서울시 강남구</div>
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    자세히 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
