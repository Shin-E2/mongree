import type { FieldValues } from "react-hook-form";
import styles from "./styles.module.css";
import type { IInputBaseProps, IInputStandardSFullProps } from "./types";

// input 컴포넌트
export default function InputBase<T extends FieldValues>({
  cssprop,
  name,
  placeholder,
  type = "text",
  errors,
  required,
  register,
  onChange,
  id,
}: IInputBaseProps<T>) {
  return (
    <div className={styles.div}>
      <input
        className={type === "file" ? "hidden" : `${cssprop} ${styles.common}`}
        {...(register ? register(name) : { name })}
        placeholder={placeholder}
        type={type}
        required={required}
        onChange={onChange}
        id={id}
      />
      {/* {errors?.map((error, i) => (
        <span key={i} className={styles.error}>
          {error}
        </span>
      ))} */}
      <span className={styles.error}>{errors}</span>
    </div>
  );
}

export const InputStandardSFull = <T extends FieldValues>({
  ...rest
}: IInputStandardSFullProps<T>) => {
  return <InputBase {...rest} cssprop={styles.standard__s__full} />;
};
