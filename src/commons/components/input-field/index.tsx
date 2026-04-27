"use client";

import { InputStandardSFull } from "../input";
import { InputTitleStandardSFull } from "../input-title";
import styles from "./styles.module.css";
import type {
  IInputFieldBaseProps,
  IInputFieldStandardSFullProps,
} from "./types";
import { useFormContext, type FieldValues } from "react-hook-form";

export default function InputFieldBase<T extends FieldValues>({
  cssprop,
  placeholder,
  required = false,
  name,
  type,
  title,
}: IInputFieldBaseProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div className={`${cssprop} ${styles.common}`}>
      <InputTitleStandardSFull title={title} required={required} />
      <InputStandardSFull
        placeholder={placeholder}
        name={name}
        type={type}
        register={register}
        errors={errors[name]?.message?.toString()}
        required={required}
      />
    </div>
  );
}

export function InputFieldStandardSFull<T extends FieldValues>({
  ...rest
}: IInputFieldStandardSFullProps<T>) {
  return <InputFieldBase {...rest} cssprop={styles.standard__s__full} />;
}
