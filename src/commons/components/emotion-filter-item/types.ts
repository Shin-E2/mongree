import { EMOTIONS } from "@/mock/emotions";

export interface IEmotion {
  id: string;
  label: string;
  image: string;
  bgColor: string;
  textColor: string;
}

export interface IEmotionFilterItemProps {
  emotion: IEmotion;
  onClick: (id: string) => void;
  isSelected: boolean;
} 