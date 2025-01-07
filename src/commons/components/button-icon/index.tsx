import Image from "next/image";
import styles from "./styles.module.css";
import type {
  IButtonIconBaseProps,
  IButtonIconCommonProps,
  IButtonIconSocialProps,
} from "./types";
import { X } from "lucide-react";

// 아이콘 버튼
export const ButtonIconBase = ({
  cssprop,
  icon,
  onClick,
}: IButtonIconBaseProps) => {
  return (
    <button className={`${cssprop} ${styles.common}`} onClick={onClick}>
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

export const ButtonIconDelete = ({ ...rest }: IButtonIconCommonProps) => {
  return (
    <ButtonIconBase
      {...rest}
      cssprop={styles.delete}
      icon={<X className="w-8 h-8 text-white" />}
    />
  );
};
