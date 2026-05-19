import type { ComponentPropsWithoutRef } from "react";
import styles from "./styles.module.css";

interface SurfaceCardProps extends ComponentPropsWithoutRef<"article"> {
  interactive?: boolean;
}

export default function SurfaceCard({
  children,
  className = "",
  interactive = true,
  ...props
}: SurfaceCardProps) {
  return (
    <article
      className={`${styles.surfaceCard} ${
        interactive ? styles.interactive : ""
      } ${className}`}
      {...props}
    >
      {children}
    </article>
  );
}
