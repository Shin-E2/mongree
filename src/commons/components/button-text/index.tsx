import styles from "./styles.module.css";
import type {
  IButtonTextBaseProps,
  IButtonTextCommonProps,
  IButtonTextWithMarginLeftSSProps,
} from "./types";

// 텍스트가 있는 버튼
export default function ButtonTextBase({
  cssprop,
  onClick,
  title,
  type,
  disabled,
}: IButtonTextBaseProps) {
  return (
    <button
      type={type}
      className={`${cssprop} ${styles.common}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}

export const ButtonTextStandardSFull = ({
  ...rest
}: IButtonTextCommonProps) => {
  return <ButtonTextBase {...rest} cssprop={styles.standard__s__full} />;
};

export const ButtonTextWithPaddingMM = ({
  ...rest
}: IButtonTextCommonProps) => {
  return <ButtonTextBase {...rest} cssprop={styles.padding__m__m} />;
};

export const ButtonTextWithMarginLeftSS = ({
  className, //동적인 스타일을 적용하기 위한 클래스
  ...rest
}: IButtonTextWithMarginLeftSSProps) => {
  console.log(rest);
  return (
    <ButtonTextBase
      {...rest}
      cssprop={`${className} ${styles.padding__m__m}`}
    />
  );
};
