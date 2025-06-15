import { Tag } from "lucide-react";
import type { TagListProps } from "./types";
import styles from "./styles.module.css";

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {tags.map(({ tag }) => (
        <span key={tag.id} className={styles.tagItem}>
          <Tag className={styles.tagIcon} />
          {tag.name}
        </span>
      ))}
    </div>
  );
}
