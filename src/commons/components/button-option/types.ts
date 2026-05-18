export interface IButtonOptionBaseProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  cssprop?: string;
  isProfile?: boolean;
  titleColor?: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  type?: "submit" | "button" | "reset";
}

export interface IButtonOptionByProfileButtonProps
  extends Omit<IButtonOptionBaseProps, "cssprop"> {
  profile_image: string | null;
}

export interface IButtonOptionCommonProps extends IButtonOptionBaseProps {}

export interface IButtonOptionEmotionProps
  extends Omit<IButtonOptionCommonProps, "title"> {
  emotion: {
    id: string;
    label: string;
    image: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
  isSelected: boolean;
}
