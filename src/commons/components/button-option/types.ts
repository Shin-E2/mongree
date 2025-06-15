import { Database } from "@/lib/supabase.types"; // Database 타입 임포트 추가

export interface IButtonOptionBaseProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  cssprop?: string;
  isProfile?: boolean;
  titleColor?: string;
  href?: string; // Link 태그인 경우
  onClick?: () => void | Promise<void>;
  type?: "submit" | "button" | "reset";
}

export interface IButtonOptionByProfileButtonProps
  extends Omit<IButtonOptionBaseProps, "cssprop"> {
  profile_image: string | null; // profiles 테이블 스키마에 맞게 변경
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
