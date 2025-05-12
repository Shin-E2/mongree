import styles from "./styles.module.css";
import type { ITagListProps } from "./types";
import { Tag as TagIcon } from "lucide-react";

export default function TagList({ tags, className }: ITagListProps) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className={`${styles.tagList} ${className ?? ""}`}>
      {tags.map((item, idx) => {
        // { tag: { id, name } } 또는 { id, name },,,나의일기랑 공개일기 부분 나중에 수정
        const tag = (item as any).tag ? (item as any).tag : item;
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
