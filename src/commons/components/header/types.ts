export interface IHeaderBaseProps {
  title: string;
  description: string;
  cssprop?: string;
}

export interface IHeaderCommonsProps
  extends Omit<IHeaderBaseProps, "cssprop"> {}
