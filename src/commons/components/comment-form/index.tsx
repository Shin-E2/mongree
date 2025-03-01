"use client";

import { useTransition } from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { addComment } from "./action";
import { z } from "zod";
import { useForm } from "react-hook-form";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "내용을 입력해주세요")
    .max(300, "300자 이내로 입력해주세요"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  diaryId: string;
  parentId?: string;
  isReply?: boolean;
  onSuccess?: () => void;
}

export function CommentForm({
  user,
  diaryId,
  parentId,
  isReply = false,
  onSuccess,
}: CommentFormProps) {
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

    startTransition(async () => {
      const result = await addComment(formData);
      if (result.success) {
        reset();
        onSuccess?.();
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={user.profileImage || DEFAULT_PROFILE_IMAGE}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full items-end relative"
        >
          <textarea
            {...register("content", {
              required: "내용을 입력해주세요",
              maxLength: {
                value: 300,
                message: "300자 이내로 입력해주세요",
              },
            })}
            placeholder={
              isReply ? "답글을 작성하세요..." : "따뜻한 댓글을 남겨주세요"
            }
            className="w-full px-4 py-3 text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none min-h-[100px] focus:outline-none"
            disabled={isPending}
          />
          {errors.content && (
            <span className="text-sm text-red-500 absolute left-0 top-[103px]">
              {errors.content.message}
            </span>
          )}
          <button
            type="submit"
            disabled={isPending || !isValid}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !isPending && isValid
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isPending ? "작성 중..." : isReply ? "답글 작성" : "댓글 작성"}
          </button>
        </form>
      </div>
    </div>
  );
}
