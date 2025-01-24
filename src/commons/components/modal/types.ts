export interface IModalBaseProps {
  cssprop: string;
  children?: React.ReactNode;
  onClose?: () => void;
  isAddress?: boolean;
  title?: string;
  discription?: string;
  okButton?: {
    text: string;
    onClick: () => void | Promise<void>;
  };
  cancelButton?: {
    text: string;
    onClick?: () => void | Promise<void>;
  };
}

export interface IModalCommonProps extends Omit<IModalBaseProps, "cssprop"> {}
