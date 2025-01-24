export interface IButtonOptionBaseProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  cssprop: string;
  isProfile?: boolean;
  titleColor?: string;
  href?: string; // Link 태그인 경우
  onClick?: () => void | Promise<void>;
}

export interface IButtonOptionByProfileButtonProps
  extends Omit<IButtonOptionBaseProps, "cssprop"> {
  imageUrl: string;
}

export interface IButtonOptionCommonProps extends IButtonOptionBaseProps {}
