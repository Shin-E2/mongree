import type { RefObject } from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface IInputBaseProps<T extends FieldValues> {
  cssprop: string;
  name: Path<T>; // react-hook-form의 path타입
  placeholder?: string;
  type?: HTMLInputElement["type"];
  errors?: string;
  register?: UseFormRegister<T>; // register(react-hook-form)
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  // ref?: RefObject<HTMLInputElement | null>;
}

export interface IInputStandardSFullProps<T extends FieldValues>
  extends Omit<IInputBaseProps<T>, "cssprop"> {}
