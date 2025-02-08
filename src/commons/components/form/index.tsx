"use client";

import {
  FormProvider,
  useForm,
  type DeepPartial,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import styles from "./styles.module.css";
import type { IFormBaseCommonProps, IFormBaseProps } from "./types";
import type { DiaryNewFormType } from "@/components/home/(dashboard)/diary/new/form.schema";

export default function FormBase<T extends FieldValues>({
  action,
  children,
  cssprop,
  onSubmit,
  resolver,
  defaultValues,
}: IFormBaseProps<T>) {
  const methods = useForm<T>({
    mode: "onBlur", // 유효성 검사
    criteriaMode: "all", // 모든 유효성 검사 에러 확인
    resolver,
    defaultValues,
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

export const FormDiaryNew = (
  props: Omit<IFormBaseProps<DiaryNewFormType>, "cssprop">
) => {
  const defaultValues: DiaryNewFormType = {
    isPrivate: true,
    emotions: [],
    title: "",
    content: "",
    tags: [],
    images: [],
  };

  return (
    <FormBase<DiaryNewFormType>
      {...props}
      cssprop={styles.diary_new}
      defaultValues={defaultValues}
    />
  );
};
