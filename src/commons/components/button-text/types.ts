export interface IButtonTextBaseProps {
  cssprop?: string;
  onClick?: () => void;
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
