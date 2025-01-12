"use client";

import DaumPostcodeEmbed from "react-daum-postcode";
import { ButtonTextWithPaddingMM } from "../button-text";
import { InputStandardSFull } from "../input";
import { InputTitleStandardSFull } from "../input-title";
import { ModalStandardFullFUll } from "../modal";
import styles from "./styles.module.css";
import type {
  IInputFieldBaseProps,
  IInputFieldStandardSFullProps,
} from "./types";
import { useState } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

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

  // 모달
  const [isOpen, setIsOpen] = useState(false);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${cssprop} ${styles.common}`}>
      <InputTitleStandardSFull
        title={title}
        required={!isAddress && required}
      />
      {isAddress ? (
        <>
          {/* 우편번호 */}
          <div className={styles.common_zonecode}>
            <InputStandardSFull
              placeholder="우편번호"
              name={`${name}.zoneCode` as Path<T>}
              register={register}
            />
            <ButtonTextWithPaddingMM
              title="검색"
              type="button"
              onClick={() => setIsOpen(true)}
            />
            {isOpen && (
              <ModalStandardFullFUll onClose={handleModalClose}>
                <DaumPostcodeEmbed />
              </ModalStandardFullFUll>
            )}
          </div>
          {/* 주소 */}
          <InputStandardSFull<T>
            placeholder="주소"
            name={`${name}.address` as Path<T>}
            register={register}
          />
          {/* 상세주소 */}
          <InputStandardSFull
            placeholder="상세주소"
            name={`${name}.detailAddress` as Path<T>}
            register={register}
          />
        </>
      ) : (
        // 주소 제외
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
