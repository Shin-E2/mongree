"use client";

import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import styles from "./styles.module.css";
import type { IFormBaseCommonProps, IFormBaseProps } from "./types";

export default function FormBase<T extends FieldValues>({
  action,
  children,
  cssprop,
  onSubmit,
  resolver,
}: IFormBaseProps<T>) {
  const methods = useForm<T>({
    mode: "onBlur", // 유효성 검사
    criteriaMode: "all", // 모든 유효성 검사 에러 확인
    resolver,
  });

  return (
    <FormProvider {...methods}>
      <form
        action={action}
        onSubmit={methods.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className={`${cssprop} ${styles.common}`}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export const FormStandardFullFull = <T extends FieldValues>({
  ...rest
}: IFormBaseCommonProps<T>) => {
  return <FormBase<T> {...rest} cssprop={styles.standard__full__full} />;
};

export const FormDiaryNew = <T extends FieldValues>({
  ...rest
}: IFormBaseCommonProps<T>) => {
  return <FormBase<T> {...rest} cssprop={styles.diary_new} />;
};
