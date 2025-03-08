import { type FieldValues } from "react-hook-form";
import styles from "./styles.module.css";
import type {
  IInputBaseProps,
  IInputStandardSFullProps,
  IInputWithCsspropProps,
  ISearchBarInputProps,
} from "./types";
import { isFieldErrors } from "@/commons/utils/type-guards";

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
  successMessage,
  readOnly = false,
  disabled = false,
}: IInputBaseProps<T>) {
  // errors가 FieldError 타입일 경우 message를 표시
  const errorMessage = isFieldErrors<T>(errors)
    ? (errors[name]?.message as string | undefined)
    : errors;

  return (
    <div className={styles.div}>
      <input
        className={type === "file" ? "hidden" : `${cssprop} ${styles.common}`}
        {...(register ? register(name!) : { name })}
        placeholder={placeholder}
        type={type}
        required={required}
        onChange={onChange}
        id={id}
        readOnly={readOnly}
        disabled={disabled}
      />
      {successMessage && (
        <span className={styles.success}>{successMessage}</span>
      )}
      {errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
}

export const InputStandardSFull = <T extends FieldValues>({
  ...rest
}: IInputStandardSFullProps<T>) => {
  return <InputBase {...rest} cssprop={styles.standard__s__full} />;
};

// 일기 등록
export const InputWithCssprop = <T extends FieldValues>({
  ...rest
}: IInputWithCsspropProps<T>) => {
  return <InputBase {...rest} />;
};

export const SearchBarInput = <T extends FieldValues>({
  ...rest
}: ISearchBarInputProps<T>) => {
  return <InputBase {...rest} cssprop={styles.search} />;
};
