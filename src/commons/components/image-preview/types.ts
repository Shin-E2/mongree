import type { FieldValues, UseFormRegister } from "react-hook-form";

export interface IImagePreviewBaseProps<T extends FieldValues> {
  cssprop: string;
  register?: UseFormRegister<T>;
}

export interface IImagePreviewByProfileProps<T extends FieldValues>
  extends Omit<IImagePreviewBaseProps<T>, "cssprop"> {}
