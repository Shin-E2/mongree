"use client";

import { memo } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import type { IFormBaseCommonProps, IFormBaseProps } from "./types";
import styles from "./styles.module.css";

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
    mode,
    criteriaMode,
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

type DiaryNewFormValues = {
  isPrivate: boolean;
  emotions: string[];
  title: string;
  content: string;
  tags: string[];
  images: File[];
};

export const FormDiaryNew = memo(
  (
    props: Omit<IFormBaseProps<DiaryNewFormValues>, "cssprop"> & {
      className?: string;
    }
  ) => {
    const defaultValues: DiaryNewFormValues = {
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
