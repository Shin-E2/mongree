export interface IInputBaseProps {
  cssprop: string;
  name: string;
  placeholder: string;
  type?: string;
}

export interface IInputStandardSFullProps
  extends Omit<IInputBaseProps, "cssprop"> {}
