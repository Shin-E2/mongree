import styles from "./styles.module.css";
import type { ICardBaseCommonProps, ICardBaseProps } from "./types";

export default function CardBase({
  children,
  cssprop,
  className,
}: ICardBaseProps) {
  return (
    <div className={`${styles.common} ${cssprop} ${className || ""}`}>
      {children}
    </div>
  );
}

export const CardStandardFullFull = ({ ...rest }: ICardBaseCommonProps) => {
  return <CardBase cssprop={styles.standard__full__full} {...rest} />;
};
