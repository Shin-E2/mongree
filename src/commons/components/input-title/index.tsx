import styles from "./styles.module.css";
import type {
  IFrameTitleBaseProps,
  IFrameTitleStandardSFullProps,
} from "./types";

// input에서 제목 부분을 나타내는 컴포넌트
export default function InputTitleBase({
  cssprop,
  title,
  required,
}: IFrameTitleBaseProps) {
  return (
    <div className={`${cssprop} ${styles.common}`}>
      {title}
      {/* 필수 입력인 경우 빨간색 별표 표시 */}
      {required && <span className={styles.common_isRequired_span}>*</span>}
    </div>
  );
}

export const InputTitleStandardSFull = ({
  ...rest
}: IFrameTitleStandardSFullProps) => {
  return <InputTitleBase {...rest} cssprop={styles.standard__s__full} />;
};
