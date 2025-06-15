import React from "react";

export interface InteractionButtonProps {
  icon: React.ReactNode; // 아이콘 컴포넌트 또는 요소
  label: string; // 버튼 레이블 추가
  count?: number; // 표시할 개수 (선택 사항)
  onClick?: () => void; // 클릭 이벤트 핸들러
  className?: string; // 추가 스타일 클래스
  isActive?: boolean; // 활성 상태 여부 (예: 공감 버튼이 이미 눌렸는지)
  disabled?: boolean; // 비활성화 상태 여부
} 