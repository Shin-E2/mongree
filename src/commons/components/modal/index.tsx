import ModalPortal from "@/commons/portal/modal-portal";
import styles from "./styles.module.css";
import type { IModalBaseProps, IModalCommonProps } from "./types";
import { ButtonIconDeleteNoBackground } from "../button-icon";
import {
  ButtonTextStandardSFull,
  ButtonTextSecondarySFull,
} from "../button-text";

export default function ModalBase({
  cssprop,
  children,
  onClose,
  isAddress,
  title,
  discription,
  okButton,
  cancelButton,
}: IModalBaseProps) {
  return (
    <ModalPortal>
      {/* 배경색 */}
      <div className={styles.container}>
        {/* 모달안의 영역 */}
        <div className={` ${cssprop} ${styles.common}`}>
          {/* 주소일때 */}
          {isAddress && (
            <>
              <ButtonIconDeleteNoBackground onClick={onClose} />
              {children}
            </>
          )}
          {(title ?? discription) && (
            <>
              {title && <span className="text-2xl font-bold">{title}</span>}
              {discription && (
                <p className="text-gray-500 text-sm whitespace-pre-line text-center pt-2">
                  {discription}
                </p>
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
