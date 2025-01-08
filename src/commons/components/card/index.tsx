import styles from "./styles.module.css";
import type { ICardBaseCommonProps, ICardBaseProps } from "./types";

export default function CardBase({ children, cssprop }: ICardBaseProps) {
  return <div className={`${styles.common} ${cssprop}`}>{children}</div>;
}

export const CardStandardFullFull = ({ ...rest }: ICardBaseCommonProps) => {
  return <CardBase cssprop={styles.standard__full__full} {...rest} />;
};
