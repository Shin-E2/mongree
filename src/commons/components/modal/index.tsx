import ModalPortal from "@/commons/portal/modal-portal";
import styles from "./styles.module.css";
import type { IModalBaseProps, IModalCommonProps } from "./types";
import { ButtonIconDeleteNoBackground } from "../button-icon";

export default function ModalBase({
  cssprop,
  children,
  onClose,
}: IModalBaseProps) {
  return (
    <ModalPortal>
      {/* 배경색 */}
      <div className={styles.container}>
        {/* 모달안의 영역 */}
        <div className={` ${cssprop} ${styles.common}`}>
          <ButtonIconDeleteNoBackground onClick={onClose} />
          {children}
        </div>
      </div>
    </ModalPortal>
  );
}

export const ModalStandardFullFUll = ({ ...rest }: IModalCommonProps) => {
  return <ModalBase cssprop={styles.standard__full__full} {...rest} />;
};
