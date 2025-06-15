import Image from "next/image";
import styles from "./styles.module.css";
import type {
  IButtonIconBaseProps,
  IButtonIconCommonProps,
  IButtonIconSocialProps,
} from "./types";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

// 아이콘 버튼
export const ButtonIconBase = ({
  cssprop,
  icon,
  onClick,
  className,
  type,
}: IButtonIconBaseProps) => {
  return (
    <button
      className={`${cssprop} ${styles.common} ${className}`}
      onClick={onClick}
      type={type}
    >
      <>{icon}</>
    </button>
  );
};

// 소셜 로그인 버튼
export const ButtonIconSocial = ({
  provider,
  ...rest
}: IButtonIconSocialProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.social}
      icon={
        <Image
          src={`/image/login/${provider}.svg`}
          alt={`${provider} 로그인`}
          width={48}
          height={48}
        />
      }
    />
  );
};

// 배경있는 삭제 버튼
export const ButtonIconDelete = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={`${styles.delete}`}
      icon={<X className={styles.deleteIcon} />}
    />
  );
};

// 배경 없는 삭제 버튼
export const ButtonIconDeleteNoBackground = ({
  ...rest
}: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.delete__no__background}
      icon={<X className={styles.deleteNoBackgroundIcon} />}
    />
  );
};

// 다음 버튼
export const ButtonIconNext = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.next}
      icon={<ArrowRight className={styles.arrowIcon} />}
    />
  );
};

// 이전 버튼
export const ButtonIconPrev = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.next}
      icon={<ArrowLeft className={styles.arrowIcon} />}
    />
  );
};
