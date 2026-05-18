export interface IStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "small" | "medium" | "large";
  className?: string;
}
