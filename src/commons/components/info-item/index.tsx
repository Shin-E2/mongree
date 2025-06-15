import styles from "./styles.module.css";
import type { IInfoItemProps } from "./types";

export default function InfoItem({ icon, text, className }: IInfoItemProps) {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}
