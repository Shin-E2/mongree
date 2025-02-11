"use client";

import React, { useState } from "react";
import { Star, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function CounselorProfilePage() {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen md:ml-64 mb-20">
      {/* Profile 상담사 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
            {/* 프로필 이미지 */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden mx-auto md:mx-0">
              <img
                src="/image/emotions/excited.svg"
                alt="상담사 프로필"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-bold">신상담 상담사</h1>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">4.8</span>
                  <span className="ml-1 text-gray-500">(123개 리뷰)</span>
                </div>
              </div>

              <p className="text-sm md:text-base text-gray-600 mb-6">
                500년 경력의 전문 상담사입니다. 우울증, 불안장애, 대인관계 등
                전문적인 상담을 제공합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  서울시 강남구
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  010-1234-5678
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  counselor@example.com
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  평일 10:00 - 19:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* 소개 정보 */}
          <div className="col-span-1 md:col-span-2 order-1">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-4">소개</h2>
              <p className="text-sm md:text-base text-gray-600">
                집에 일찍 가고 싶은 사람들을 치료해줘용 ❤️
              </p>
            </div>
          </div>

          {/* Right: 지도, 예약 - 모바일에서는 소개 아래, 데스크탑에서는 우측에 sticky */}
          <div className="col-span-1 order-3 md:order-2 space-y-6 md:sticky md:top-4">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <div className="aspect-w-1 aspect-h-1 bg-yellow-200 rounded-lg mb-4 w-full h-48 md:h-64">
                map
              </div>
              <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                상담 예약하기
              </button>
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div className="col-span-1 md:col-span-2 order-3 md:order-2">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-semibold">리뷰</h2>
              {/* Review List */}
              <div className="space-y-6">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="ml-3">
                          <div className="font-medium">김토닥</div>
                          <div className="text-xs md:text-sm text-gray-500">
                            2024.03.15
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-600">
                      상담이 너무 마음에 들었어요. 항상 집에 일찍 가고 싶었는데
                      상담 후 집에 덜 그립고 강일역 지박령이 되었습니다. 너무
                      행복해요
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 md:items-end">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="md:w-24 sm:w-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  리뷰 작성
                </button>
                {showReviewForm && (
                  <div className="mb-8 border rounded-lg p-4 md:p-6 w-full">
                    <h3 className="text-lg font-medium mb-4">리뷰 작성</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          별점
                        </label>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button key={rating} className="text-yellow-400">
                              <Star className="w-6 h-6 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          리뷰 내용
                        </label>
                        <textarea
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          rows={4}
                          placeholder="상담은 어떠셨나요?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          영수증 첨부
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 text-gray-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-sm text-gray-500">
                                클릭하여 영수증 이미지를 업로드하세요
                              </p>
                            </div>
                            <input type="file" className="hidden" />
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-row justify-end gap-2 space-x-3">
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg transition-colors"
                        >
                          취소
                        </button>
                        <button className="w-full sm:w-auto px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                          등록하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
