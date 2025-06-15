import ModalPortal from "@/commons/portal/modal-portal";
import styles from "./styles.module.css";
import { ModalType, ModalConfig } from "./types";
import type {
  IModalBaseProps,
  IModalCommonProps,
  ISmartModalProps,
} from "./types";
import { ButtonIconDeleteNoBackground } from "../button-icon";
import {
  ButtonTextStandardSFull,
  ButtonTextSecondarySFull,
} from "../button-text";

// variant에 따른 CSS
const getVariantClass = (variant?: ModalType): string => {
  if (!variant) return "";

  const variantMap: Record<ModalType, string> = {
    [ModalType.ERROR_CRITICAL]: styles.variant__error__critical,
    [ModalType.ERROR_WARNING]: styles.variant__error__warning,
    [ModalType.SUCCESS]: styles.variant__success,
    [ModalType.INFO]: styles.variant__info,
    [ModalType.CONFIRM]: styles.variant__confirm,
  };

  return variantMap[variant] || "";
};

// 타입별 모달 설정 함수
const getModalConfig = (modalType: ModalType): ModalConfig => {
  const configMap: Record<ModalType, ModalConfig> = {
    [ModalType.ERROR_CRITICAL]: {
      defaultTitle: "심각한 오류 발생",
      showRetry: true,
    },
    [ModalType.ERROR_WARNING]: {
      defaultTitle: "오류 발생",
      showRetry: true,
    },
    [ModalType.SUCCESS]: {
      defaultTitle: "성공!",
      showRetry: false,
    },
    [ModalType.INFO]: {
      defaultTitle: "알림",
      showRetry: false,
    },
    [ModalType.CONFIRM]: {
      defaultTitle: "확인",
      showRetry: false,
    },
  };

  return configMap[modalType];
};

export default function ModalBase({
  cssprop,
  variant,
  children,
  onClose,
  isAddress,
  title,
  discription,
  okButton,
  cancelButton,
}: IModalBaseProps) {
  const variantClass = getVariantClass(variant);

  return (
    <ModalPortal>
      <div className={styles.container}>
        <div className={`${cssprop} ${styles.common} ${variantClass}`}>
          {isAddress && (
            <>
              <ButtonIconDeleteNoBackground onClick={onClose} />
              {children}
            </>
          )}

          {(title ?? discription) && (
            <>
              {title && <span className={styles.titleText}>{title}</span>}
              {discription && (
                <p className={styles.descriptionText}>{discription}</p>
              )}
            </>
          )}

          {(okButton ?? cancelButton) && (
            <div className={styles.common__buttons}>
              {cancelButton?.text && (
                <ButtonTextSecondarySFull
                  title={cancelButton?.text}
                  type="button"
                  onClick={cancelButton.onClick}
                />
              )}
              {okButton?.text && (
                <ButtonTextStandardSFull
                  title={okButton?.text}
                  type="button"
                  onClick={okButton.onClick}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}

export const ModalStandardFullFUll = ({ ...rest }: IModalCommonProps) => {
  return <ModalBase cssprop={styles.standard__full__full} {...rest} />;
};

export const ModalStandardFitFit = ({ ...rest }: IModalCommonProps) => {
  return <ModalBase cssprop={styles.standard__fit__fit} {...rest} />;
};

// 통합 모달 컴포넌트
export function SmartModal({
  type,
  isOpen,
  title,
  message,
  details,
  onRetry,
  onConfirm,
  onClose,
  confirmText = "확인",
  cancelText = "취소",
}: ISmartModalProps) {
  // 모달이 열려있지 않거나 타입이 없으면 렌더링하지 않음
  if (!isOpen || !type) return null;

  const config = getModalConfig(type);
  const finalTitle = title || config.defaultTitle;
  const finalMessage = details ? `${message}\n\n${details}` : message;

  // 버튼 텍스트 결정
  const getOkButtonText = (): string => {
    if (type === ModalType.CONFIRM) return confirmText;
    if (onRetry && config.showRetry) return "재시도";
    return "확인";
  };

  // 버튼 클릭 핸들러 결정
  const getOkButtonHandler = (): (() => void) => {
    if (type === ModalType.CONFIRM) return onConfirm || onClose;
    if (onRetry && config.showRetry) return onRetry;
    return onClose;
  };

  // 취소 버튼 표시 여부 결정
  const shouldShowCancelButton = (): boolean => {
    return (onRetry && config.showRetry) || type === ModalType.CONFIRM;
  };

  return (
    <ModalStandardFitFit
      variant={type}
      title={finalTitle}
      discription={finalMessage}
      okButton={{
        text: getOkButtonText(),
        onClick: getOkButtonHandler(),
      }}
      cancelButton={
        shouldShowCancelButton()
          ? {
              text: cancelText,
              onClick: onClose,
            }
          : undefined
      }
      onClose={onClose}
    />
  );
}

export { ModalType };
