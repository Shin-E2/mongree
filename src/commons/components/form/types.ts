import type {
  FieldValues,
  Resolver,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";

export interface IFormBaseProps<T extends FieldValues> {
  action?: (payload: FormData) => void;
  children: React.ReactNode;
  cssprop: string;
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: UseFormProps<T>["defaultValues"];
  className?: string;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  criteriaMode?: "firstError" | "all";
}

export interface IFormBaseCommonProps<T extends FieldValues>
  extends Omit<IFormBaseProps<T>, "cssprop"> {}
