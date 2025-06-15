import { MouseEventHandler } from "react";

export interface IStarRatingProps {
  rating: number; // 현재 별점 (1-5)
  onRatingChange?: (rating: number) => void; // 별점 변경 핸들러 (선택 사항)
  size?: "small" | "medium" | "large"; // 별점 아이콘 크기
  className?: string; // 추가적인 스타일 클래스
} 