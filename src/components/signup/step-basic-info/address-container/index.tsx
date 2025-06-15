"use client";

import { ButtonTextWithPaddingMM } from "@/commons/components/button-text";
import { InputStandardSFull } from "@/commons/components/input";
import { ModalStandardFullFUll } from "@/commons/components/modal";
import DaumPostcodeEmbed from "react-daum-postcode";
import styles from "./styles.module.css";
import useSignupStepBasicInfoAddressContainer from "./hook";
import type { ISignupStepBasicInfoAddressContainerProp } from "./types";

export default function SignupStepBasicInfoAddressContainer({
  isAddress,
  name,
}: ISignupStepBasicInfoAddressContainerProp) {
  const { register, setIsOpen, isOpen, handleModalClose, handleComplete } =
    useSignupStepBasicInfoAddressContainer({ isAddress, name });

  return (
    <section className={styles.section}>
      {/* 우편번호 */}
      <div className={styles.section_zonecode}>
        <InputStandardSFull
          placeholder="우편번호"
          name={`${name}.zoneCode`}
          register={register}
          disabled
        />
        <ButtonTextWithPaddingMM
          title="검색"
          type="button"
          onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <ModalStandardFullFUll onClose={handleModalClose} isAddress>
            <DaumPostcodeEmbed onComplete={handleComplete} />
          </ModalStandardFullFUll>
        )}
      </div>
      {/* 주소 */}
      <InputStandardSFull
        placeholder="주소"
        name={`${name}.address`}
        register={register}
        disabled
      />
      {/* 상세주소 */}
      <InputStandardSFull
        placeholder="상세주소"
        name={`${name}.detailAddress`}
        register={register}
      />
    </section>
  );
}
