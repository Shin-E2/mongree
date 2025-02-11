"use client";

import { HeaderStandardMFull } from "@/commons/components/header";
import { Calendar, ChevronDown, Filter, Search } from "lucide-react";
import React, { useState } from "react";

export default function DiaryListPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col h-full mb-20">
      <HeaderStandardMFull
        title="나의 일기장"
        description="오늘의 감정을 기록하세요"
      />
      <div className="p-4 md:p-8">
        {/* 검색 및 필터 영역 */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            {/* 검색바 */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="일기 검색..."
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute top-2.5 left-3 w-5 h-5 text-gray-400" />
            </div>

            {/* 필터 버튼 */}
            <div className="flex items-center space-x-2">
              <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                감정
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4 mr-2" />
                기간
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* 뷰 전환 버튼 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView("grid")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
                view === "grid"
                  ? "text-white bg-indigo-600 hover:bg-indigo-700"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              격자뷰
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
                view === "list"
                  ? "text-white bg-indigo-600 hover:bg-indigo-700"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              목록뷰
            </button>
          </div>
        </div>

        {/* 격자뷰 */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-white border rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-200"></div>
                      <span className="font-medium text-sm sm:text-base">
                        집이 보고싶다!
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      2024.10.29
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">
                    오늘도 나는 집이 매우 보고 싶었지만...
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                      #칼퇴
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                      #침대좋아
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                      공개
                    </div>
                    <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700">
                      자세히 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 목록뷰
          <div className="space-y-4 md:space-y-6">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start p-4 md:p-6">
                  {/* 기분상태아이콘 */}
                  <div className="flex items-center sm:flex-col sm:items-center w-full sm:w-24 mb-4 sm:mb-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-200 text-center text-4xl sm:text-5xl mr-3 sm:mr-0 sm:mb-2">
                      🤬
                    </div>
                    <span className="text-sm text-gray-600">화남</span>
                  </div>

                  {/* 제목, 내용 등 */}
                  <div className="flex-grow sm:px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-medium">
                        집이 보고싶다!
                      </h3>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs sm:text-sm text-gray-500 ml-2">
                          공개
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      오늘도 나는 집이 매우 보고 싶었지만...
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        #독서
                      </span>
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        #휴식
                      </span>
                    </div>
                  </div>

                  {/* 날짜 */}
                  <span className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-0">
                    2024.10.29
                  </span>
                </div>

                {/* 이미지 */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 mt-2">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100"></div>
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100"></div>
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100"></div>
                  </div>
                </div>

                {/* 댓글, 공감 */}
                <div className="px-4 sm:px-6 py-3 border-t flex items-center gap-4">
                  <span className="text-xs sm:text-sm text-gray-500">
                    댓글 5
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    공감 12
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 md:mt-8">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 bg-white border rounded-lg hover:bg-gray-50">
              이전
            </button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-white bg-indigo-600 rounded-lg">
              1
            </button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 bg-white border rounded-lg hover:bg-gray-50">
              다음
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
