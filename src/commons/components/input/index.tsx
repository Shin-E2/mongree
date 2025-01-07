import styles from "./styles.module.css";
import type { IInputBaseProps, IInputStandardSFullProps } from "./types";

// input 컴포넌트
export default function InputBase({
  cssprop,
  name,
  placeholder,
  type,
}: IInputBaseProps) {
  return (
    <input
      className={`${cssprop} ${styles.common}`}
      name={name}
      placeholder={placeholder}
      type={type}
    />
  );
}

export const InputStandardSFull = ({ ...rest }: IInputStandardSFullProps) => {
  return <InputBase {...rest} cssprop={styles.standard__s__full} />;
};
