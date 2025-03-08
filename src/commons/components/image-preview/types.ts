import type { FieldValues, UseFormRegister } from "react-hook-form";

export interface IImagePreviewBaseProps<T extends FieldValues> {
  cssprop: string;
  register?: UseFormRegister<T>;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
}

export interface IImagePreviewByProfileProps<T extends FieldValues>
  extends Omit<IImagePreviewBaseProps<T>, "cssprop"> {}

export interface IImagePreviewByDiaryNewProps<T extends FieldValues>
  extends Omit<IImagePreviewBaseProps<T>, "cssprop"> {
  className?: string;
}
