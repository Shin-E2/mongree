"use client";

import { useState } from "react";
import type { Address } from "react-daum-postcode";
import { useFormContext } from "react-hook-form";
import type { ISignupStepBasicInfoAddressContainerProp } from "./types";

export default function useSignupStepBasicInfoAddressContainer({
  isAddress,
  name,
}: ISignupStepBasicInfoAddressContainerProp) {
  const { register, setValue } = useFormContext();

  // 모달
  const [isOpen, setIsOpen] = useState(false);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  // 우편번호 검색 후 정보
  const handleComplete = (data: Address) => {
    console.log(data.address, data.zonecode);
    const zonecode = data.zonecode;
    const address = data.address;

    if (isAddress) {
      setValue(`${name}.zoneCode`, zonecode, {
        shouldValidate: true,
      });
      setValue(`${name}.address`, address, {
        shouldValidate: true,
      });
      setIsOpen(false); // 모달 닫기
    }
  };
  return {
    register,
    setIsOpen,
    isOpen,
    handleModalClose,
    handleComplete,
  };
}
