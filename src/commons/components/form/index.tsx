"use client";

import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import styles from "./styles.module.css";
import type { IFormBaseCommonProps, IFormBaseProps } from "./types";
import { memo } from "react";

function FormBase<T extends FieldValues>({
  action,
  children,
  cssprop,
  onSubmit,
  resolver,
  defaultValues,
  className = "",
  mode = "onBlur",
  criteriaMode = "all",
}: IFormBaseProps<T>) {
  const methods = useForm<T>({
    mode, // 유효성 검사 모드 (onBlur, onChange, onSubmit 등)
    criteriaMode, // 모든 유효성 검사 에러 확인
    resolver,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        action={action}
        onSubmit={methods.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
        className={`${cssprop} ${styles.common} ${className}`}
      >
        {children}
      </form>
    </FormProvider>
  );
}

// 메모이제이션된 FormBase 컴포넌트
const MemoizedFormBase = memo(FormBase) as typeof FormBase;

export default MemoizedFormBase;

export const FormStandardFullFull = <T extends FieldValues>({
  className = "",
  ...rest
}: IFormBaseCommonProps<T>) => {
  return (
    <MemoizedFormBase<T>
      {...rest}
      cssprop={styles.standard__full__full}
      className={className}
    />
  );
};

// DiaryNew 폼 최적화
export const FormDiaryNew = memo(
  (props: Omit<IFormBaseProps<any>, "cssprop"> & { className?: string }) => {
    const defaultValues = {
      isPrivate: true,
      emotions: [],
      title: "",
      content: "",
      tags: [],
      images: [],
    };

    return (
      <MemoizedFormBase
        {...props}
        cssprop={styles.diary_new}
        defaultValues={defaultValues}
        className={props.className}
      />
    );
  }
);


