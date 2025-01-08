import styles from "./styles.module.css";
import type { IProgressBarProps, IProgressBarStandardSFullProps } from "./types";



export default function ProgressBarBase({
  cssprop,
  progress,
}: IProgressBarProps) {
  return (
    <div className={styles.common}>
      <div
        className={`${styles.common_div} ${cssprop}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export const ProgressBarStandardSFull = ({
  ...rest
}: IProgressBarStandardSFullProps) => {
  return <ProgressBarBase {...rest} cssprop={styles.standard__s__full} />;
};
