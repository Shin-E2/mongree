import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export interface IInputBaseProps<T extends FieldValues> {
  cssprop: string;
  name?: Path<T>; // react-hook-form의 path타입
  placeholder?: string;
  type?: HTMLInputElement["type"];
  errors?: FieldErrors<T> | string;
  register?: UseFormRegister<T>; // register(react-hook-form)
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  successMessage?: string; // 성공했을 때 메시지
  readOnly?: boolean;
  disabled?: boolean;
  multiple?: boolean; // type이 file일 경우 다중선택
}

export interface IInputStandardSFullProps<T extends FieldValues>
  extends Omit<IInputBaseProps<T>, "cssprop"> {}

export interface IInputWithCsspropProps<T extends FieldValues>
  extends IInputBaseProps<T> {}

export interface ISearchBarInputProps<T extends FieldValues>
  extends Omit<IInputBaseProps<T>, "cssprop" | "name"> {}
