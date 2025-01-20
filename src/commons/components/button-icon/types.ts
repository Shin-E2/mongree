export interface IButtonIconBaseProps {
  cssprop: string;
  icon?: React.ReactNode;
  onClick?: (() => void) | ((e: React.MouseEvent) => void);
  className?: string;
}

export interface IButtonIconCommonProps
  extends Omit<IButtonIconBaseProps, "cssprop"> {}

// 소셜 로그인
export interface IButtonIconSocialProps
  extends Omit<IButtonIconBaseProps, "cssprop"> {
  provider: "google" | "kakao" | "naver";
}
