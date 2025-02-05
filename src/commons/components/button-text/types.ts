export interface IButtonTextBaseProps {
  cssprop?: string;
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
  title: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  href?: string; // 링크 태그일 경우
}

export interface IButtonTextCommonProps
  extends Omit<IButtonTextBaseProps, "cssprop"> {}

export interface IButtonTextWithMarginLeftSSProps
  extends Omit<IButtonTextBaseProps, "cssprop"> {
  className?: string;
}

export interface IButtonTextWithCssprop extends IButtonTextBaseProps {}
