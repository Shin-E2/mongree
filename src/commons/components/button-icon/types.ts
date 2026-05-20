export interface IButtonIconBaseProps {
  cssprop: string;
  icon?: React.ReactNode;
  onClick?: (() => void) | ((e: React.MouseEvent) => void);
  className?: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  title?: string;
}

export interface IButtonIconCommonProps
  extends Omit<IButtonIconBaseProps, "cssprop"> {}

export interface IButtonIconSocialProps
  extends Omit<IButtonIconBaseProps, "cssprop"> {
  provider: "google" | "kakao";
}
