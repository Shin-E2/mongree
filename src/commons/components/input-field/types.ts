export interface IInputFieldBaseProps {
  cssprop: string;
  placeholder: string;
  required?: boolean;
  name: string;
  type?: string;
  title: string;
}

export interface IInputFieldStandardSFullProps
  extends Omit<IInputFieldBaseProps, "cssprop"> {}
