import type { Emotion } from "@/mock/emotions";

export interface IEmotionFilterItemProps {
  emotion: Emotion;
  onClick: (id: string) => void;
  isSelected: boolean;
}
