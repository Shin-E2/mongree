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

export default function InputFieldBase({
  cssprop,
  placeholder,
  required = false,
  name,
  type,
  title,
  isAddress = false,
}: IInputFieldBaseProps) {
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
          <div className="flex gap-2 w-1/3">
            <InputStandardSFull placeholder="우편번호" name="zoneCode" />
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
          <InputStandardSFull placeholder="주소" name="address" />
          {/* 상세주소 */}
          <InputStandardSFull placeholder="상세주소" name="detailAddress" />
        </>
      ) : (
        <InputStandardSFull placeholder={placeholder} name={name} type={type} />
      )}
    </div>
  );
}

export const InputFieldStandardSFull = ({
  ...rest
}: IInputFieldStandardSFullProps) => {
  return <InputFieldBase {...rest} cssprop={styles.standard__s__full} />;
};
