import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import styles from "./styles.module.css";
import type {
  IButtonIconBaseProps,
  IButtonIconCommonProps,
  IButtonIconSocialProps,
} from "./types";

const SOCIAL_LABELS: Record<IButtonIconSocialProps["provider"], string> = {
  google: "Google 로그인",
  kakao: "Kakao 로그인",
};

export const ButtonIconBase = ({
  cssprop,
  icon,
  onClick,
  className = "",
  type = "button",
  disabled,
  title,
}: IButtonIconBaseProps) => {
  return (
    <button
      className={`${cssprop} ${styles.common} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      <>{icon}</>
    </button>
  );
};

export const ButtonIconSocial = ({
  provider,
  ...rest
}: IButtonIconSocialProps) => {
  const label = SOCIAL_LABELS[provider];

  return (
    <ButtonIconBase
      {...rest}
      title={label}
      cssprop={styles.social}
      icon={
        <Image
          src={`/image/login/${provider}.svg`}
          alt={label}
          width={48}
          height={48}
        />
      }
    />
  );
};

export const ButtonIconDelete = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={`${styles.delete}`}
      icon={<X className={styles.deleteIcon} />}
    />
  );
};

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

export const ButtonIconNext = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.next}
      icon={<ArrowRight className={styles.arrowIcon} />}
    />
  );
};

export const ButtonIconPrev = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.next}
      icon={<ArrowLeft className={styles.arrowIcon} />}
    />
  );
};
