import type { FieldValues, Resolver, SubmitHandler } from "react-hook-form";

export interface IFormBaseProps<T extends FieldValues> {
  action?: (payload: FormData) => void;
  children: React.ReactNode;
  cssprop: string;
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
}

export interface IFormBaseCommonProps<T extends FieldValues = FieldValues>
  extends Omit<IFormBaseProps<T>, "cssprop"> {}
