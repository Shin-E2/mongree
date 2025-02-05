import type { IHeaderBaseProps, IHeaderCommonsProps } from "./types";
import styles from "./styles.module.css";

export default function HeaderBase({
  title,
  description,
  cssprop,
}: IHeaderBaseProps) {
  return (
    <div className={`${styles.common} ${cssprop}`}>
      <h1 className={styles.common__title}>{title}</h1>
      <p className={styles.common__description}>{description}</p>
    </div>
  );
}

export const HeaderStandardMFull = ({ ...rest }: IHeaderCommonsProps) => {
  return <HeaderBase {...rest} cssprop={styles.standard__m__full} />;
};
