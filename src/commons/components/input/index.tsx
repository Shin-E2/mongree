import { type FieldValues } from "react-hook-form";
import styles from "./styles.module.css";
import type {
  IInputBaseProps,
  IInputStandardSFullProps,
  ISearchBarInputProps,
  IInputWithCsspropProps,
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
  className,
  iconLeft,
}: IInputBaseProps<T> & { className?: string }) {
  // errors가 FieldError 타입일 경우 message를 표시
  const errorMessage = isFieldErrors<T>(errors)
    ? (errors[name]?.message as string | undefined)
    : errors;

  return (
    <div className={styles.div}>
      <div className={styles.inputWrapper}>
        {iconLeft && (
          <div className={styles.iconWrapper}>
            {React.cloneElement(iconLeft as React.ReactElement, {
              className: styles.iconBase,
            })}
          </div>
        )}
        <input
          className={
            type === "file"
              ? "hidden"
              : `${cssprop} ${styles.common} ${iconLeft ? "pl-10" : "pl-3"} ${
                  className || ""
                }`
          }
          {...(register ? register(name!) : { name })}
          placeholder={placeholder}
          type={type}
          required={required}
          onChange={onChange}
          id={id}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
      {successMessage && (
        <span className={styles.success}>{successMessage}</span>
      )}
      {errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
}

export const InputStandardSFull = <T extends FieldValues>({
  className,
  ...rest
}: IInputStandardSFullProps<T> & { className?: string }) => {
  return (
    <InputBase
      {...rest}
      cssprop={styles.standard__s__full}
      className={className}
    />
  );
};

// 일기 등록
export const InputWithCssprop = <T extends FieldValues>({
  className,
  ...rest
}: IInputWithCsspropProps<T> & { className?: string }) => {
  return <InputBase {...rest} className={className} />;
};

export const SearchBarInput = <T extends FieldValues>({
  className,
  ...rest
}: ISearchBarInputProps<T> & { className?: string }) => {
  return <InputBase {...rest} cssprop={styles.search} className={className} />;
};
