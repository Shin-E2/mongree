import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface IInputFieldBaseProps<T extends FieldValues> {
  cssprop: string;
  placeholder: string;
  required?: boolean;
  name: Path<T>;
  type?: InputFieldType;
  title: string;
  errors?: string;
  register?: UseFormRegister<T>;
  disabled?: boolean;
}

export interface IInputFieldStandardSFullProps<T extends FieldValues>
  extends Omit<IInputFieldBaseProps<T>, "cssprop"> {}

// 입력 필드 타입을 명시적으로 정의
export type InputFieldType = "text" | "email" | "password" | "number";
