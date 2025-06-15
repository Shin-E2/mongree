export interface ICardBaseProps {
  children: React.ReactNode;
  cssprop?: string;
  className?: string;
}

export interface ICardBaseCommonProps extends Omit<ICardBaseProps, "cssprop"> {}
