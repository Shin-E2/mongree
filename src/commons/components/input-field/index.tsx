"use client";

import SignupStepBasicInfoAddressContainer from "../../../components/signup/step-basic-info/address-container";
import { InputBase, InputStandardSFull } from "../input";
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
  isAddress = false,
}: IInputFieldBaseProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <div className={`${cssprop} ${styles.common}`}>
      <InputTitleStandardSFull
        title={title}
        required={!isAddress && required}
      />
      {/* 주소인 경우 */}
      {isAddress ? (
        <SignupStepBasicInfoAddressContainer
          isAddress={isAddress}
          name={name}
        />
      ) : (
        <InputStandardSFull
          placeholder={placeholder}
          name={name}
          type={type}
          register={register}
          errors={errors[name]?.message?.toString()}
          required={required}
        />
      )}
    </div>
  );
}

export function InputFieldStandardSFull<T extends FieldValues>({
  ...rest
}: IInputFieldStandardSFullProps<T>) {
  return <InputFieldBase {...rest} cssprop={styles.standard__s__full} />;
}
