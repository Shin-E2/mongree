"use client";

import { useTransition } from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { addComment } from "./action";
import { z } from "zod";
import { useForm, type FieldValues } from "react-hook-form";
import ButtonTextBase from "../button-text";
import { InputWithCssprop } from "../input";
import { Database } from "@/lib/supabase.types";
import { ICommentFormProps } from "./types";
import styles from "./styles.module.css";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "내용을 입력해주세요")
    .max(300, "300자 이내로 입력해주세요"),
});

type CommentFormData = z.infer<typeof commentSchema>;

type UserProfileForCommentForm = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "username" | "profile_image"
>;

export function CommentForm({
  user,
  diaryId,
  parentId,
  isReply = false,
  onSuccess,
  placeholder,
  onReply: onReplyProp,
  onCommentSubmitted,
}: ICommentFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CommentFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: CommentFormData) => {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("diaryId", diaryId);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    if (user?.id) {
      formData.append("userId", user.id);
    } else {
      console.error("사용자 ID를 찾을 수 없습니다.");
      return;
    }

    startTransition(async () => {
      const result = await addComment(formData);
      if (result.success) {
        reset();
        onSuccess?.();
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.flexContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={user?.profile_image || DEFAULT_PROFILE_IMAGE}
            alt={user?.username || "사용자"}
            width={40}
            height={40}
            className={styles.userImage}
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          <InputWithCssprop
            cssprop="w-full"
            placeholder={
              isReply
                ? "답글을 작성해주세요."
                : placeholder || "댓글을 작성해주세요."
            }
            name="content"
            register={register}
            errors={errors.content?.message}
            required
          />
          <div className={styles.buttonContainer}>
            <ButtonTextBase
              title={isReply ? "답글 작성" : "댓글 작성"}
              cssprop={styles.commentButton}
              type="submit"
              disabled={isPending || !isValid}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
