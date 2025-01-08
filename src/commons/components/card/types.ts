export interface ICardBaseProps {
  children: React.ReactNode;
  cssprop?: string;
}

export interface ICardBaseCommonProps extends Omit<ICardBaseProps, "cssprop"> {}
