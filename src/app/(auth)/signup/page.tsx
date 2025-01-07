"use client";

import { ButtonTextWithMarginLeftSS } from "@/commons/components/button-text";
import { StepIndicator } from "@/commons/components/step-indicator";
import SignupStepBasicInfo from "@/components/signup/step-basic-info";
import SignupStepProfileCheck from "@/components/signup/step-profile-check";
import { useState } from "react";

// 회원가입의 각 단계
// fields는 각 단계에서 검증해야 할 폼 필드들을 나타냄
const SIGNUP_STEPS = [
  {
    id: 1,
    label: "기본정보",
    Component: SignupStepBasicInfo,
    fields: [
      "name",
      "nickname",
      "email",
      "password",
      "passwordConfirm",
      "address.zoneCode",
      "address.address",
      "address.detailAddress",
    ],
  },
  {
    id: 2,
    label: "프로필설정",
    Component: SignupStepProfileCheck,
    fields: [],
  },
] as const;

export default function SignupPage() {
  // 현재 회원가입 단계(0: 기본정보, 1: 프로필설정)
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = SIGNUP_STEPS[currentStep];
  const isLastStep = currentStep === SIGNUP_STEPS.length - 1;
  // currentStep이 0일 때 50%, 1일 때 100%
  const progress = ((currentStep + 1) / SIGNUP_STEPS.length) * 100;

  // 다음
  const handleNext = () => {
    // 다음 단계로 이동
    setCurrentStep((prev) => prev + 1);
  };

  // 이전
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 현재 단계의 컴포넌트
  const StepComponent = currentStepData.Component;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 진행 단계 표시 영역 */}
        <div className="mb-8">
          <div className="relative">
            {/* 단계 인디케이터 */}
            <div className="flex justify-around mb-2">
              {SIGNUP_STEPS.map((step) => (
                <StepIndicator
                  key={step.id}
                  label={step.label}
                  step={step.id}
                  currentStep={currentStepData.id}
                />
              ))}
            </div>
            {/* 진행 상태 바 */}
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 폼 영역 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form className="space-y-6">
            {/* 현재 단계의 컴포넌트 렌더링 */}
            <StepComponent />

            {/* 이전/다음 버튼 */}
            <div className="flex justify-between pt-4">
              {currentStep > 0 && (
                <ButtonTextWithMarginLeftSS
                  type="button"
                  onClick={handlePrev}
                  title="이전"
                />
              )}

              <ButtonTextWithMarginLeftSS
                type="button" // 퍼플리싱을 위한 button type 추후 submit으로 변경 가능
                // 동적으로 스타일을 적용하기 위한 className
                className={currentStep === 0 ? "ml-auto" : ""}
                title={isLastStep ? "가입완료" : "다음"}
                onClick={handleNext}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
