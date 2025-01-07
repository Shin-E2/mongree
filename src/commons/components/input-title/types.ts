export interface IFrameTitleBaseProps {
  cssprop: string;
  title: string;
  required?: boolean;
}

export interface IFrameTitleStandardSFullProps
  extends Omit<IFrameTitleBaseProps, "cssprop"> {}
