import { InputStandardSFull } from "../input";
import { InputTitleStandardSFull } from "../input-title";
import styles from "./styles.module.css";
import type {
  IInputFieldBaseProps,
  IInputFieldStandardSFullProps,
} from "./types";

export default function InputFieldBase({
  cssprop,
  placeholder,
  required = false,
  name,
  type,
  title,
}: IInputFieldBaseProps) {
  return (
    <div className={`${cssprop} ${styles.common}`}>
      <InputTitleStandardSFull title={title} required={required} />
      <InputStandardSFull placeholder={placeholder} name={name} type={type} />
    </div>
  );
}

//<InputField className={} placeholder="이메일을 입력해주세요" isRequired="true" name="email" type="text" title="이메일" />

export const InputFieldStandardSFull = ({
  ...rest
}: IInputFieldStandardSFullProps) => {
  return <InputFieldBase {...rest} cssprop={styles.standard__s__full} />;
};
