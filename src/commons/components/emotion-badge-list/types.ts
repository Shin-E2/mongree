import { type EmotionBadgeProps } from "../emotion-badge/types";

export interface EmotionBadgeListProps {
  emotions: EmotionBadgeProps['emotion'][]; // EmotionBadge 컴포넌트에서 사용되는 감정 타입 배열
  maxVisible?: number; // 표시할 최대 감정 개수
  className?: string; // 컨테이너에 적용할 클래스
} 