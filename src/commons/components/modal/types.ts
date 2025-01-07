export interface IModalBaseProps {
  cssprop: string;
  children: React.ReactNode;
  onClose: () => void;
}

export interface IModalCommonProps extends Omit<IModalBaseProps, "cssprop"> {}
