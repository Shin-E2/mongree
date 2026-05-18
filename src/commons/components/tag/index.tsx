import { Tag as TagIcon } from "lucide-react";
import type { ITagListProps } from "./types";
import styles from "./styles.module.css";

export default function TagList({ tags, className }: ITagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`${styles.tagList} ${className ?? ""}`}>
      {tags.map((item) => {
        const tag = "tag" in item ? item.tag : item;

        return (
          <span key={tag.id} className={styles.tagItem}>
            <TagIcon className={styles.tagIcon} />
            {tag.name}
          </span>
        );
      })}
    </div>
  );
}
