export interface IInputFieldBaseProps {
  cssprop: string;
  placeholder: string;
  required?: boolean;
  name: string;
  type?: string;
  title: string;
  isAddress?: boolean;
}

export interface IInputFieldStandardSFullProps
  extends Omit<IInputFieldBaseProps, "cssprop"> {}
