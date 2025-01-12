import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface IAddressErrors {
  zoneCode?: string;
  address?: string;
  detailAddress?: string;
}

export interface IInputFieldBaseProps<T extends FieldValues> {
  cssprop: string;
  placeholder: string;
  required?: boolean;
  name: Path<T>;
  type?: InputFieldType;
  title: string;
  isAddress?: boolean;
  errors?: string;
  register?: UseFormRegister<T>;
}

export interface IInputFieldStandardSFullProps<T extends FieldValues>
  extends Omit<IInputFieldBaseProps<T>, "cssprop"> {}

// 주소 관련 필드명을 상수로 관리
export type AddressField = "zoneCode" | "address" | "detailAddress";

// 입력 필드 타입을 명시적으로 정의
export type InputFieldType = "text" | "email" | "password" | "number";
