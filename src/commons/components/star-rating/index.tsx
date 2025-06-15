import { Star } from "lucide-react";
import type { IStarRatingProps } from "./types";
import styles from "./styles.module.css";

export default function StarRating({
  rating,
  onRatingChange,
  size = "medium",
  className,
}: IStarRatingProps) {
  const starSizeClass = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  }[size];

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSizeClass} ${styles.star} ${
            star <= rating ? styles.filled : styles.empty
          } ${onRatingChange ? styles.clickable : ""}`}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
}
