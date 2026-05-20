export type EmotionBadgeItem = {
  id: string;
  label: string;
  image: string | null;
};

export interface EmotionBadgeProps {
  emotion: EmotionBadgeItem;
  className?: string;
}
