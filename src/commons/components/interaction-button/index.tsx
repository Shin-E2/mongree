import React from "react";
import styles from "./styles.module.css";
import type { InteractionButtonProps } from "./types";

export function InteractionButton({
  icon,
  count,
  onClick,
  className,
  disabled,
}: InteractionButtonProps) {
  return (
    <button
      className={`${styles.container} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon}
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </button>
  );
}
