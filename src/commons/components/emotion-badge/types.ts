import { type Emotion } from "@/mock/emotions";

export interface EmotionBadgeProps {
  emotion: Emotion & { bgColor: string }; // Emotion 타입과 bgColor 포함
  className?: string;
} 