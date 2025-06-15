import React from "react";
import styles from "./styles.module.css";
import type { InteractionButtonProps } from "./types";

export function InteractionButton({
  icon,
  count,
  onClick,
  className,
}: InteractionButtonProps) {
  return (
    <button
      className={`${styles.container} ${className || ""}`}
      onClick={onClick}
    >
      {icon}
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </button>
  );
}
