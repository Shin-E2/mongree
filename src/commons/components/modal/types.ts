export enum ModalType {
  ERROR_CRITICAL = 'error-critical',
  ERROR_WARNING = 'error-warning',
  SUCCESS = 'success',
  INFO = 'info',
  CONFIRM = 'confirm'
}

export interface IModalBaseProps {
  cssprop: string;
  variant?: ModalType;
  children?: React.ReactNode;
  isOpen: boolean;
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

export interface ISmartModalProps {
  type: ModalType | null;
  isOpen: boolean;
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface ModalConfig {
  defaultTitle: string;
  showRetry: boolean;
}
