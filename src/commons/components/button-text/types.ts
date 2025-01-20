import type { MouseEvent } from "react";

export interface IButtonTextBaseProps {
  cssprop?: string;
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
  title: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
}

export interface IButtonTextCommonProps
  extends Omit<IButtonTextBaseProps, "cssprop"> {}

export interface IButtonTextWithMarginLeftSSProps
  extends Omit<IButtonTextBaseProps, "cssprop"> {
  className?: string;
}
